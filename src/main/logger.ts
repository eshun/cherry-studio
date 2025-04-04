import fs from 'node:fs'
import path from 'node:path'

import { app } from 'electron'
import logger from 'electron-log'

// 获取当前日期，格式化为 YYYY-MM-DD
export const getDateString = () => {
  const now = new Date()
  return now.toISOString().split('T')[0] // "YYYY-MM-DD"
}

// 生成每日的日志目录路径
export const getLogPath = () => {
  const logPath = path.join(app.getPath('userData'), 'logs', getDateString())
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true })
  }

  return logPath
}

// 生成日志文件路径
export const resolveMainPathFn = () => {
  return path.join(getLogPath(), 'main.log')
}

export const resolveWebPathFn = () => {
  return path.join(getLogPath(), 'renderer.log')
}

export function createDefaultLogger() {
  logger.transports.file.level = 'info'
  logger.transports.file.resolvePathFn = resolveMainPathFn
  logger.initialize()

  return logger
}

export function createRendererLogger() {
  const rendererLogger = logger.create({ logId: 'renderer' })
  rendererLogger.transports.file.level = 'info'
  rendererLogger.transports.file.resolvePathFn = resolveWebPathFn
  rendererLogger.initialize()

  return rendererLogger
}

const defaultLogger = createDefaultLogger()
const rendererLogger = createRendererLogger()
export { defaultLogger, rendererLogger }
