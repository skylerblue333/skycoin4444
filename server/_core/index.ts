import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerBetaRoutes } from "./betaRoutes";
import { registerBetaAccessAuthRoutes } from "./betaAccessAuthRoutes";
import { registerPlatformKernelRoutes } from "./platformKernel";
import { registerEventFabricRoutes } from "./eventRegistry";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { closeDatabasePool } from "../db";
import { serveStatic, setupVite } from "./vite";
import { registerObservability } from "./observability";
import { assertProductionBetaConfig } from "./productionConfig";
import { registerRequestSecurity } from "./requestSecurity";
import { registerSecurityHeaders } from "./securityHeaders";
import { createDependencyReadinessCoordinator } from "./readiness";
import { registerDatabasePoolRoutes } from "./databasePoolRoutes";
import { registerFatalRuntimeMonitoring } from "./fatalRuntime";
import {
  handleStartupFailure,
  listenHttpServer,
  resolveStartupPort,
  serverStartupOptionsFromEnv,
} from "./serverStartup";
import {
  createOutboxDispatcherService,
  registerOutboxDispatcherRoutes,
} from "./outboxDispatcher";
import {
  ApplicationShutdownCoordinator,
  applicationShutdownOptionsFromEnv,
  registerApplicationShutdownSignals,
  registerShutdownDiagnostics,
} from "./shutdown";
import {
  ConcurrencyGate,
  RuntimeLifecycle,
  configureHttpServer,
  createConcurrencyMiddleware,
  createDrainGuard,
  createShutdownController,
  registerRuntimeRoutes,
  runtimeOptionsFromEnv,
} from "./runtimeControl";

const DEFAULT_BODY_LIMIT = "2mb";

registerFatalRuntimeMonitoring();

async function startServer() {
  assertProductionBetaConfig();
  const startupOptions = serverStartupOptionsFromEnv();
  const runtimeOptions = runtimeOptionsFromEnv();
  const lifecycle = new RuntimeLifecycle();
  const concurrency = new ConcurrencyGate(runtimeOptions.maxInFlightRequests);
  const outboxDispatcher = createOutboxDispatcherService();
  const dependencyReadiness = createDependencyReadinessCoordinator({
    dispatcher: outboxDispatcher,
  });

  const app = express();
  const server = createServer(app);
  configureHttpServer(server, runtimeOptions);
  const httpShutdown = createShutdownController(
    server,
    lifecycle,
    runtimeOptions.shutdownGraceMs
  );
  const applicationShutdown = new ApplicationShutdownCoordinator({
    lifecycle,
    http: httpShutdown,
    backgroundHooks: [
      {
        name: "event-outbox-dispatcher",
        run: () => outboxDispatcher.stop(),
      },
    ],
    finalHooks: [
      {
        name: "mysql-pool",
        run: () => closeDatabasePool(),
      },
    ],
    options: applicationShutdownOptionsFromEnv(),
  });

  app.disable("x-powered-by");
  registerSecurityHeaders(app);
  registerObservability(app);
  registerRequestSecurity(app);
  registerRuntimeRoutes(
    app,
    lifecycle,
    concurrency,
    dependencyReadiness,
    runtimeOptions
  );
  registerDatabasePoolRoutes(app);
  registerShutdownDiagnostics(app, applicationShutdown);
  app.use(createDrainGuard(lifecycle));
  app.use(createConcurrencyMiddleware(concurrency));

  app.use(express.json({ limit: DEFAULT_BODY_LIMIT }));
  app.use(express.urlencoded({ limit: DEFAULT_BODY_LIMIT, extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerBetaAccessAuthRoutes(app);
  registerBetaRoutes(app, dependencyReadiness);
  registerPlatformKernelRoutes(app);
  registerEventFabricRoutes(app);
  registerOutboxDispatcherRoutes(app, outboxDispatcher);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = await resolveStartupPort(startupOptions);
  registerApplicationShutdownSignals(applicationShutdown);

  if (port !== startupOptions.preferredPort) {
    console.log(
      `Development port ${startupOptions.preferredPort} is busy; using ${port}`
    );
  }

  await listenHttpServer(server, port);

  if (lifecycle.currentPhase() === "starting") {
    lifecycle.markReady();
  }
  outboxDispatcher.start();
  console.log(`Server running on http://localhost:${port}/`);
}

startServer().catch(error =>
  handleStartupFailure({
    error,
    cleanup: closeDatabasePool,
  })
);
