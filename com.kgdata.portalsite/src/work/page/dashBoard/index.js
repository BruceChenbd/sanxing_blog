import * as React from 'react'
import { Row, Col, Input, message, Tag, Icon, Button, Tabs, Checkbox, Select, Statistic, Pagination } from 'antd'
import { observer, inject } from 'mobx-react'
import AccessLine from '@components/lineChart/access'
import DownLine from '@components/lineChart/down'
import './index.scss'
import { queryVisit } from '../../server/index'

@inject('UserStore')
@observer
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visit: 0
        }
    }

    componentDidMount() {
        queryVisit().then(res => {
            if (res.data.code == 0 && res.data.data.length > 0) {
                this.setState({
                    visit: res.data.data[0].count
                })
            } else {
                this.setState({
                    visit: 0
                })
            }
        })
    }


    render() {

        return (
            <div className="Dashboard">
                <div className="static_num">
                    <div className="static_item">
                        <Statistic title="网站访问量" value={this.state.visit} />
                    </div>
                    <div className="static_item">
                        <Statistic title="文档下载量" value={2893} />
                    </div>
                    <div className="static_item">
                        <Statistic title="用户数量" value={893} />
                    </div>
                </div>
                <div className="access_chart">
                    <h2 className="chart_title">访问趋势</h2>
                    <div style={{ height: '300px' }}>
                        <AccessLine />
                    </div>
                </div>
                <div className="down_chart">
                    <h2 className="chart_title">文档下载量趋势</h2>
                    <div style={{ height: '450px' }}>
                        <DownLine />
                    </div>
                </div>
            </div>
        )
    }
}