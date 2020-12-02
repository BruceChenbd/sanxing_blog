import React, { useState } from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import {  Tabs } from 'antd'
import Header from '../../components/header'
import CommonHead from '../../components/commonHeader'
import Link from 'next/link'
import './index.less'
import { queryDetail } from '../../utils/service'


class artDetail extends React.Component {
    state = {
        isShow: false,
        detailInfo: null
    }
    async componentDidMount() {
        console.log(this.props)
        let asPath = this.props.router.asPath;
        let id = this.props.router.query.id || asPath.split('?')[1].split('=')[1];
        let res = await queryDetail({id})
        console.log(res,'res')

        if (res && res.data && res.data.length > 0) {
            this.setState({
                detailInfo: res.data[0]
            })
        }
    }
    showModal = () => {
        this.setState({
            isShow: true
        })
    }
    closeModal = () => {
        this.setState({
            isShow: false
        })
    }
    render() {
        const { detailInfo } = this.state;
        return (
            <>
                <CommonHead />
                <Header />
                <div style={{height: '80px'}}></div>
                <div className="art_detail">
                  {
                      detailInfo? <div className="art_detail_body">
                            <h1 className="art_title">
                                {detailInfo.title}
                            </h1>
                            <div className="art_info">
                                <span>作者：三省编辑部</span>
                                <span>
                                    发布时间：{detailInfo.createTime}
                                </span>
                            </div>
                            <div className="art_cover">
                                <img src={detailInfo.cover_image} />
                            </div>
                            <div className="art_content" dangerouslySetInnerHTML={{__html: detailInfo.content}}>

                            </div>
                      </div>: <div>暂无数据</div>
                  }
                  {/* <div className="goback">
                      <Link href="/bytalk">返回列表</Link>
                  </div> */}
                </div>
            </>
        )
    }
}

export default withRouter(artDetail)