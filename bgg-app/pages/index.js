import React, { useState } from 'react'
import { Collapse } from 'antd'
import Header from '../components/header'
import Link from 'next/link'
import CommonHead from '../components/commonHeader'
import { queryList, test } from '../utils/service'
import QueueAnim from 'rc-queue-anim';
import '../styles/index.less'

const { Panel } = Collapse;
class Home extends React.Component {
  state = {
    artlist: []
  }
  async componentDidMount() {
    let result = await test({key:'技术',pageNum: 1})
    let artlist = []
    if (result && result.data && result.data.articleArr.length>0) {
        artlist = result.data.articleArr
    }
    this.setState({
      artlist
    })
  }

  render() {
    let { artlist } = this.state;
    return (
      <>
        <CommonHead />
        <Header />
        <div style={{height: '80px'}}></div>
        <div className="technology">
          <QueueAnim 
          animConfig={{opacity:[1, 0],translateY:[0, -30]}}
          delay={500}>
             {
               artlist? artlist.map(item => {
                 return <div className="art_item" key={item._id}>
                      <div className="left">
                        <h2 className="art_title">
                          <Link href={`/detail?id=${item._id}`}>
                            <a> {item.title}</a>
                          </Link>
                        </h2>
                        <div className="art_content">
                          <p>
                            {item.desc}
                          </p>
                        </div>
                        <div className="art_footer">
                          <span>
                            三省编辑部
                          </span>
                          <span>
                            {item.createTime}
                          </span>
                        </div>
                      </div>
                      <div className="right">
                        <img src={item.cover_image} alt=""/>
                      </div>
                 </div>
               }): <div>暂无数据!</div>
             }
          </QueueAnim>
        </div>
      </>
    )
  }
}

export default Home