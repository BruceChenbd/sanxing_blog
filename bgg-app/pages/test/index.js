import './index.less'
import './index.css'
import a from  '../../static/imgs/a.jpg'
import axios from 'axios'

export default class T extends React.Component {
    static async getInitialProps () {
        const result = await axios.get('/getData');
        return {
            data: result.data
        }
    }
    async componentDidMount() {
       
        // console.log(result)
    }
    render() {
        console.log(this.props)
        return <div className="test">
        我是测试页面
        <img src={a} />
        <style jsx>
             {
                 `.test {
                     background: blue
                 }
                 `
             }
        </style>
    </div>
    }
}