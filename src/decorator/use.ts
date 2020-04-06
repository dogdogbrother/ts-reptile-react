import { RequestHandler } from 'express'
import  'reflect-metadata'

export function use(middleware: RequestHandler) {
  return function(target: any, key: string) {
    Reflect.defineMetadata('middleware', middleware, target, key)
  }
}