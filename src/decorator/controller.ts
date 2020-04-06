import router from '../router'
import { RequestHandler } from 'express'
import  'reflect-metadata'
import { Methods } from './request'

export function controller(target: new (...args: any[]) => any) {
  for(let key in target.prototype) {
    const path: string = Reflect.getMetadata('path', target.prototype, key)
    const method: Methods = Reflect.getMetadata('method', target.prototype, key)
    const handler: RequestHandler = target.prototype[key]
    const middleware = Reflect.getMetadata('middleware', target.prototype, key)
    if (path && method && handler) {
      if (middleware) {
        router[method](path, middleware, handler)
      } else {
        router[method](path, handler)
      }
      
    }
  }
}