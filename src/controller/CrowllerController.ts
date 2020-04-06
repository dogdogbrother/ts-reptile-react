import fs from 'fs'
import path from 'path'
import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import { controller, get, use } from './decorator'
import { getResponseData } from '../utils/util'
import Crowller from '../utils/crowller'
import DellAnalyzer from '../utils/analyzer'

interface RequestWithBody extends Request{
  body: {
      [key: string]: string | undefined
  }  
}

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false
  if (isLogin) {
      next()
  } else {
      res.json(getResponseData(null, '请先登录'))
  }
}

@controller
class CrowllerController {
  @get('/getData')
  @use(checkLogin)
  getData(req: RequestWithBody, res: Response) {
    const secret = 'x3b174jsx'
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
    const coursePath = '../../data/course.json'
    const analyzer = DellAnalyzer.getInstance()
    new Crowller(url, coursePath,  analyzer)
    res.json(getResponseData(true))
  }
  
  @get('/showData')
  @use(checkLogin)
  showData(req: RequestWithBody, res: Response) {
    try {
      const position = path.resolve(__dirname, '../../data/course.json')
      const result = fs.readFileSync(position, 'UTF-8')
      res.json(getResponseData(JSON.parse(result)))
    } catch(e) {
        res.json(getResponseData(false, '数据不存在'))
    }
  }
}
