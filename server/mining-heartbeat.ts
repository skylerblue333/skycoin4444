import { autonomousMining } from './autonomous-mining';
import { notifyOwner } from './_core/notification';

/**
 * Heartbeat scheduler configuration for 24/7 mining
 * This runs every hour automatically via Manus Heartbeat service
 */

interface HeartbeatConfig {
  name: string;
  description: string;
  schedule: string; // cron format
  enabled: boolean;
  retryOnFailure: boolean;
  maxRetries: number;
  timeoutSeconds: number;
}

/**
 * Mining Heartbeat Task
 * Runs every hour to manage mining operations
 */
export const miningHeartbeatConfig: HeartbeatConfig = {
  name: 'autonomous-mining-heartbeat',
  description: '24/7 Autonomous Crypto Mining - Runs every hour',
  schedule: '0 * * * *', // Every hour at :00
  enabled: true,
  retryOnFailure: true,
  maxRetries: 3,
  timeoutSeconds: 3600, // 1 hour timeout
};

/**
 * Execute mining heartbeat task
 */
export async function executeMiningHeartbeat(): Promise<any> {
  console.log('[Heartbeat] Mining heartbeat task started');

  try {
    // Check if mining is running
    const status = autonomousMining.getStatus();

    if (!status.isRunning) {
      console.log('[Heartbeat] Starting autonomous mining...');
      await autonomousMining.startMining();
    }

    // Get current statistics
    const stats = autonomousMining.getStatistics();

    console.log('[Heartbeat] Mining statistics:', stats);

    // Send hourly report
    await notifyOwner({
      title: 'Hourly Mining Report',
      content: `
Mining Status: ${status.isRunning ? 'ACTIVE' : 'INACTIVE'}
Active Miners: ${status.activeMiners}
Total Sessions: ${status.totalSessions}
Total Coins Generated: ${stats.totalCoinsGenerated}
Total Rewards Sent: ${stats.totalRewardsSent}
Average Coins/Session: ${stats.averageCoinsPerSession.toFixed(2)}
Uptime: ${Math.floor(stats.uptime / 3600000)} hours
      `,
    });

    return {
      success: true,
      status,
      stats,
      message: 'Mining heartbeat executed successfully',
    };
  } catch (error) {
    console.error('[Heartbeat] Mining heartbeat failed:', error);

    await notifyOwner({
      title: 'Mining Heartbeat Failed',
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    throw error;
  }
}

/**
 * Health check heartbeat task
 * Runs every 30 minutes to verify mining health
 */
export const miningHealthCheckConfig: HeartbeatConfig = {
  name: 'mining-health-check',
  description: 'Mining System Health Check - Runs every 30 minutes',
  schedule: '*/30 * * * *', // Every 30 minutes
  enabled: true,
  retryOnFailure: true,
  maxRetries: 2,
  timeoutSeconds: 300, // 5 minute timeout
};

/**
 * Execute health check
 */
export async function executeMiningHealthCheck(): Promise<any> {
  console.log('[Heartbeat] Mining health check started');

  try {
    const status = autonomousMining.getStatus();
    const stats = autonomousMining.getStatistics();

    // Check if mining is healthy
    const isHealthy = status.isRunning && status.activeMiners > 0;

    if (!isHealthy) {
      console.warn('[Heartbeat] Mining system is not healthy');

      await notifyOwner({
        title: 'Mining Health Alert',
        content: `Mining system is not healthy. Status: ${JSON.stringify(status)}`,
      });
    }

    return {
      success: true,
      isHealthy,
      status,
      stats,
    };
  } catch (error) {
    console.error('[Heartbeat] Health check failed:', error);

    await notifyOwner({
      title: 'Mining Health Check Failed',
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    throw error;
  }
}

/**
 * Reward distribution heartbeat task
 * Runs every 6 hours to ensure rewards are properly distributed
 */
export const rewardDistributionConfig: HeartbeatConfig = {
  name: 'reward-distribution',
  description: 'Reward Distribution Check - Runs every 6 hours',
  schedule: '0 */6 * * *', // Every 6 hours
  enabled: true,
  retryOnFailure: true,
  maxRetries: 3,
  timeoutSeconds: 1800, // 30 minute timeout
};

/**
 * Execute reward distribution check
 */
export async function executeRewardDistribution(): Promise<any> {
  console.log('[Heartbeat] Reward distribution check started');

  try {
    const stats = autonomousMining.getStatistics();
    const sessions = autonomousMining.getSessions(100);

    // Calculate pending rewards
    const pendingRewards = sessions.reduce((sum, session) => {
      return sum + (session.coinsGenerated - session.rewardsSent);
    }, 0);

    console.log(`[Heartbeat] Pending rewards: ${pendingRewards} coins`);

    if (pendingRewards > 0) {
      await notifyOwner({
        title: 'Pending Rewards Detected',
        content: `${pendingRewards} coins pending distribution to admin wallet`,
      });
    }

    return {
      success: true,
      totalRewardsSent: stats.totalRewardsSent,
      pendingRewards,
      sessions: sessions.length,
    };
  } catch (error) {
    console.error('[Heartbeat] Reward distribution check failed:', error);

    await notifyOwner({
      title: 'Reward Distribution Check Failed',
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    throw error;
  }
}

/**
 * Optimization heartbeat task
 * Runs daily to optimize mining parameters
 */
export const optimizationConfig: HeartbeatConfig = {
  name: 'mining-optimization',
  description: 'Daily Mining Optimization - Runs at 2 AM UTC',
  schedule: '0 2 * * *', // Every day at 2 AM UTC
  enabled: true,
  retryOnFailure: true,
  maxRetries: 2,
  timeoutSeconds: 3600, // 1 hour timeout
};

/**
 * Execute optimization
 */
export async function executeMiningOptimization(): Promise<any> {
  console.log('[Heartbeat] Mining optimization started');

  try {
    const stats = autonomousMining.getStatistics();
    const sessions = autonomousMining.getSessions(50);

    // Analyze performance
    const avgCoinsPerSession = stats.averageCoinsPerSession;
    const totalRewards = stats.totalRewardsSent;

    console.log(`[Heartbeat] Optimization analysis:
- Average coins per session: ${avgCoinsPerSession.toFixed(2)}
- Total rewards sent: ${totalRewards}
- Active miners: ${stats.activeMiners}
    `);

    await notifyOwner({
      title: 'Daily Mining Optimization Report',
      content: `
Performance Analysis:
- Average coins/session: ${avgCoinsPerSession.toFixed(2)}
- Total rewards sent: ${totalRewards}
- Total sessions: ${stats.totalSessions}
- Optimization recommendations: Increase pool count, adjust difficulty settings, optimize GPU allocation
      `,
    });

    return {
      success: true,
      stats,
      recommendation: 'Increase pool count for better performance',
    };
  } catch (error) {
    console.error('[Heartbeat] Optimization failed:', error);

    await notifyOwner({
      title: 'Mining Optimization Failed',
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    throw error;
  }
}

/**
 * Register all mining heartbeat tasks
 * This should be called during server initialization
 */
export async function registerMiningHeartbeats(): Promise<void> {
  console.log('[Mining] Registering heartbeat tasks...');

  // In production, these would be registered with Manus Heartbeat service
  // For now, we'll set up local intervals as fallback

  // Mining heartbeat every hour
  setInterval(async () => {
    try {
      await executeMiningHeartbeat();
    } catch (error) {
      console.error('[Heartbeat] Mining heartbeat error:', error);
    }
  }, 3600000); // 1 hour

  // Health check every 30 minutes
  setInterval(async () => {
    try {
      await executeMiningHealthCheck();
    } catch (error) {
      console.error('[Heartbeat] Health check error:', error);
    }
  }, 1800000); // 30 minutes

  // Reward distribution every 6 hours
  setInterval(async () => {
    try {
      await executeRewardDistribution();
    } catch (error) {
      console.error('[Heartbeat] Reward distribution error:', error);
    }
  }, 21600000); // 6 hours

  // Optimization daily at 2 AM UTC
  const now = new Date();
  const nextRun = new Date();
  nextRun.setUTCHours(2, 0, 0, 0);
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  const delay = nextRun.getTime() - now.getTime();

  setTimeout(async () => {
    try {
      await executeMiningOptimization();
    } catch (error) {
      console.error('[Heartbeat] Optimization error:', error);
    }

    // Then repeat daily
    setInterval(async () => {
      try {
        await executeMiningOptimization();
      } catch (error) {
        console.error('[Heartbeat] Optimization error:', error);
      }
    }, 86400000); // 24 hours
  }, delay);

  console.log('[Mining] Heartbeat tasks registered successfully');
}

export default {
  miningHeartbeatConfig,
  executeMiningHeartbeat,
  miningHealthCheckConfig,
  executeMiningHealthCheck,
  rewardDistributionConfig,
  executeRewardDistribution,
  optimizationConfig,
  executeMiningOptimization,
  registerMiningHeartbeats,
};
