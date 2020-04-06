import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import DellAnalyzer from './analyzer'

export interface Analyzer {
    analyze: (html: string, filePath: string) => string
}

class Crowller {
    private filePath = path.resolve(__dirname, this.coursePath)
    private async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }
    writeFile(content: string) {
        fs.writeFileSync(this.filePath, content)
    }
    private async initSpiderProcess() {
        const html = await this.getRawHtml()
        
        const fileContent = this.analyzer.analyze(html, this.filePath)
        this.writeFile(fileContent)
    }
    constructor(private url: string, private coursePath: string, private analyzer: Analyzer) {
        this.initSpiderProcess()
    }
}

export default Crowller
const secret = 'x3b174jsx'
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`
const coursePath = '../../data/course.json'
const analyzer = DellAnalyzer.getInstance()

new Crowller(url, coursePath,  analyzer)
