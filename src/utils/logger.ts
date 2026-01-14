/**
 * Logger Utility
 * Development ve production için conditional logging
 */

const isDev = process.env.NODE_ENV === "development";

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface LoggerOptions {
  prefix?: string;
  showTimestamp?: boolean;
}

/**
 * Conditional logger - sadece development'ta log gösterir
 */
export const logger = {
  /**
   * Normal log - sadece dev'de gösterir
   */
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log("[LOG]", ...args);
    }
  },

  /**
   * Info log - sadece dev'de gösterir
   */
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info("[INFO]", ...args);
    }
  },

  /**
   * Warning log - sadece dev'de gösterir
   */
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn("[WARN]", ...args);
    }
  },

  /**
   * Error log - her zaman gösterir (production'da da)
   */
  error: (...args: unknown[]) => {
    console.error("[ERROR]", ...args);
  },

  /**
   * Debug log - sadece dev'de gösterir
   */
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug("[DEBUG]", ...args);
    }
  },

  /**
   * Gruplanmış log
   */
  group: (label: string, fn: () => void) => {
    if (isDev) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  },

  /**
   * Tablo formatında log
   */
  table: (data: unknown) => {
    if (isDev) {
      console.table(data);
    }
  },

  /**
   * Performans ölçümü
   */
  time: (label: string) => {
    if (isDev) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (isDev) {
      console.timeEnd(label);
    }
  },
};

/**
 * Prefixed logger oluştur
 */
export function createLogger(prefix: string) {
  return {
    log: (...args: unknown[]) => logger.log(`[${prefix}]`, ...args),
    info: (...args: unknown[]) => logger.info(`[${prefix}]`, ...args),
    warn: (...args: unknown[]) => logger.warn(`[${prefix}]`, ...args),
    error: (...args: unknown[]) => logger.error(`[${prefix}]`, ...args),
    debug: (...args: unknown[]) => logger.debug(`[${prefix}]`, ...args),
  };
}

export default logger;
