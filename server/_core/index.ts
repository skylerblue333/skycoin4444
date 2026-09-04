import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerBetaRoutes } from "./betaRoutes";
import { registerPlatformKernelRoutes } from "./platformKernel";
import { registerEventFabricRoutes } from "./eventRegistry";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerObservability } from "./observability";
import { assertProductionBetaConfig } from "./productionConfig";
import {
  ConcurrencyGate,
  RuntimeLifecycle,
  configureHttpServer,
  createConcurrencyMiddleware,
  createDrainGuard,
  createShutdownController,
  registerRuntimeRoutes,
  registerShutdownSignals,
  runtimeOptionsFromEnv,
} from "./runtimeControl";

const DEFAULT_BODY_LIMIT = "2mb";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  assertProductionBetaConfig();
  const runtimeOptions = runtimeOptionsFromEnv();
  const lifecycle = new RuntimeLifecycle();
  const concurrency = new ConcurrencyGate(runtimeOptions.maxInFlightRequests);

  const app = express();
  const server = createServer(app);
  configureHttpServer(server, runtimeOptions);

  app.disable("x-powered-by");
  registerObservability(app);

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()"
    );
    next();
  });

  registerRuntimeRoutes(app, lifecycle, concurrency);
  app.use(createDrainGuard(lifecycle));
  app.use(createConcurrencyMiddleware(concurrency));

  app.use(express.json({ limit: DEFAULT_BODY_LIMIT }));
  app.use(express.urlencoded({ limit: DEFAULT_BODY_LIMIT, extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerBetaRoutes(app);
  registerPlatformKernelRoutes(app);
  registerEventFabricRoutes(app);

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

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  const shutdownController = createShutdownController(
    server,
    lifecycle,
    runtimeOptions.shutdownGraceMs
  );
  registerShutdownSignals(shutdownController);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    if (lifecycle.currentPhase() === "starting") {
      lifecycle.markReady();
    }
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
