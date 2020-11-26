const express = require('express')
const next = require('next')
const axios = require('axios')
const {
    createProxyMiddleware
} = require('http-proxy-middleware')

const devProxy = {
    '/api': {
        target: 'http://127.0.0.1:3800', // 端口自己配置合适的
        changeOrigin: true
    }
}
const port = parseInt(process.env.PORT, 10) || 18080
const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev
})
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        if (dev && devProxy) {
            Object.keys(devProxy).forEach(function (context) {
                server.use(createProxyMiddleware(context, devProxy[context]))
            })
        }
        // server.get('/getTecArticleList', async (req, res) => {
        //     const resData = await axios.get('http://81.70.202.166:8088/api/public/getArticleList', {
        //         params: req.query
        //     })
        //     if (resData && resData.data.code == 0) {
        //         res.status(200).send(resData.data.data)
        //     } else {
        //         res.status('暂无数据！')
        //     }
        // })

        // server.get('/getDetail', async (req, res) => {
        //     const resData = await axios.get(`http://81.70.202.166:8088/api/public/getArticleInfo/${req.query.id}`)
        //     if (resData && resData.data.code == 0) {
        //         res.status(200).send(resData.data.data)
        //     } else {
        //         res.status('暂无数据！')
        //     }
        // })

        // server.get('/getPicture', async (req, res) => {
        //     const resData = await axios.get(`http://81.70.202.166:8088/api/public/getPictureList`)
        //     if (resData && resData.data.code == 0) {
        //         res.status(200).send(resData.data.data)
        //     } else {
        //         res.status('暂无数据！')
        //     }
        // })

        // server.get('/api/getFrameList', async (req, res) => {
        //     const resData = await axios.get(`http://81.70.202.166:8088/api/public/getFrameList`)
        //     if (resData && resData.data.code == 0) {
        //         res.status(200).send(resData.data.data)
        //     } else {
        //         res.status('暂无数据！')
        //     }
        // })
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