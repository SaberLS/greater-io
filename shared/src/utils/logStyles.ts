// eslint-disable-next-line unicorn/import-style
import chalk, { type ChalkInstance } from 'chalk'
import { Logger, type LogMode } from './Logger'

const formatBanner = (message: string, color: ChalkInstance): string => {
  const line = '='.repeat(40)
  return [color(line), message, color(line)].join('\n')
}

const createLog = (
  icon: string,
  iconColor: ChalkInstance,
  mode: LogMode,
  fun: 'prodLog' | 'log' = 'log',
  lineColor = iconColor.bold
) => {
  return (title: string, message?: string): void => {
    Logger[fun](
      mode,
      formatBanner(
        iconColor(`${icon}: ${title}`) +
          (message === undefined ? '' : `\n\t${message}`),
        lineColor
      )
    )
  }
}

const success = createLog('✔ SUCCESS', chalk.green, 'info', 'prodLog')
const failure = createLog('✖ Error', chalk.red, 'error', 'prodLog')
const warn = createLog('⚠ WARNING', chalk.yellow, 'warn', 'prodLog')
const info = createLog('ℹ INFO', chalk.blue, 'info', 'prodLog')

const log = (...args: Parameters<typeof console.log>): void => {
  Logger.log('log', ...args)
}

export { failure, info, log, success, warn }
