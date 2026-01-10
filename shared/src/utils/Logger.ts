type LogMode = Exclude<keyof Console, 'constructor' | 'Console' | 'assert'>

class Logger {
  private static isProduction = false
  private static silent = false

  // Control toggles
  public static setProductionMode(isProd: boolean): void {
    Logger.isProduction = isProd
  }

  public static setSilentMode(silent: boolean): void {
    Logger.silent = silent
  }

  // Core log function
  static log<K extends LogMode>(
    type: K,
    ...args: Parameters<Console[K]>
  ): void {
    if (Logger.silent) return // silent mode wins

    if (!Logger.isProduction) {
      console[type](...args)
    }
  }

  static prodLog<K extends LogMode>(
    type: K,
    ...args: Parameters<Console[K]>
  ): void {
    if (Logger.silent) return

    console[type](...args)
  }
}

export { Logger, type LogMode }
