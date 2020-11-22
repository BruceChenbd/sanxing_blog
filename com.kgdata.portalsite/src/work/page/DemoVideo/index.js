import * as React from 'react'
import { Button, Col, Input } from 'antd'
import { observer, inject } from 'mobx-react'
import './index.scss'

@inject('UserStore')
@observer
export default class DemoVideo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
             url: 'https://cn.bing.com/',
             isEdit: false
        }
    }

    componentDidMount() {

    }

    editUrl = () => {
       this.setState({
         isEdit: true
       })
    }
    saveUrl = () => {
        this.setState({
            isEdit: false
        })
    }
    inputUrl = (e) => {
       console.log(e.target.value)
       this.setState({
           url: e.target.value
       })
    }
    cancel = () => {
        this.setState({
            isEdit: false
        })
    }
    goUrl = () => {
        window.open(this.state.url)
    }
    render() {
        const { url,isEdit } = this.state;
        return (
            <div className="DemoVideo">
                <div>
                    {
                        isEdit? <div>
                            视频链接：<Input value={url} className="change_url" placeholder="输入URL" onChange={this.inputUrl} />
                        </div> :
                        <div>
                            视频链接：{url}
                        </div>
                    }
                </div>
                <div style={{marginTop: '24px'}}>
                    <Button onClick={isEdit ? this.saveUrl : this.editUrl} style={{marginRight: '8px'}} type="primary">{isEdit ? '确定':'修改'}</Button>
                    <Button onClick={isEdit? this.cancel: this.goUrl}>{isEdit? '取消':'前往浏览视频'}</Button>
                </div>
            </div>
        )
    }
}