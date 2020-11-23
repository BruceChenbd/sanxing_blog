const express = require('express')
const next = require('next')
const axios = require('axios')
const { createProxyMiddleware } = require('http-proxy-middleware')

const devProxy = {
    '/api': {
        target: 'http://127.0.0.1:8088', // 端口自己配置合适的
        pathRewrite: {
            '^/api': '/'
        },
        changeOrigin: true
    }
}
console.log(process.env.port)
const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev
})
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        if (dev && devProxy) {
            Object.keys(devProxy).forEach(function(context) {
                server.use(createProxyMiddleware(context, devProxy[context]))
            })
        }
        server.get('/getData', async (req, res) => {
            const resData = await axios.get('https://api.jisuapi.com/calendar/query',{
                params: {
                    appkey: 'd437f2408ec177ca'
                }
            })
            if (resData.data.status == 0) {
                res.status(200).send(resData.data.result)
            } else {
                res.status(500).send('接口错误')
            }
            // console.log(resData,'resData')
            // console.log(req,'req')
          
        })
        server.all('*', (req, res) => {
            handle(req, res)
        })
        
        
        server.listen(port, err => {
            if (err) {
                throw err
            }
            console.log(`> Ready on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.log('An error occurred, unable to start the server')
        console.log(err)
    })