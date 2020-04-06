import { Request, Response } from 'express'
import { get, controller, post } from './decorator'
import { getResponseData } from '../utils/util'

interface RequestWithBody extends Request{
  body: {
      [key: string]: string | undefined
  }  
}


@controller
class LoginController {
  @post('/login')
  login(req: RequestWithBody, res: Response){
    const { password } = req.body
    const isLogin = req.session ? req.session.login : undefined
    if (isLogin) {
        res.json(getResponseData(false, '已经登录过'))
    } else {
        // 这里要做个类型保护,因为我有可能后面不再用这个session中间件了.
        if (password === '123' && req.session) {
            req.session.login = true
            res.json(getResponseData(true))
        } else {
            res.json(getResponseData(false, '登录失败'))
        }
    }
  }
  @get('/logout')
  logout(req: Request, res: Response) {
    if (req.session) {
        req.session.login = undefined
    }
    res.json(getResponseData(true))
  }
  @get('/')
  home(req: Request, res: Response) {
    const isLogin = req.session ? req.session.login : false
    if (isLogin) {
        res.send(`
            <html>
                <body>
                    <a href="/getData">爬</a>
                    <a href="/logout">退出</a>
                </body>
            </html>
        `)
    } else {
        res.send(`
            <html>
                <body>
                    <form method="post" action="/login">
                        <input type="password" name="password">
                        <button>登录</bnutton>
                    </form>
                </body>
            </html>
        `)
    }
  }
}