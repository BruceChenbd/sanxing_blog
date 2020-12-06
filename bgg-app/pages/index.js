import React, { useState } from 'react'
import { Spin  } from 'antd'
import Header from '../components/header'
import Link from 'next/link'
import CommonHead from '../components/commonHeader'
import { queryList, test } from '../utils/service'
import QueueAnim from 'rc-queue-anim';
import InfiniteScroll from 'react-infinite-scroll-component'
import '../styles/index.less'


class Home extends React.Component {
  state = {
    artlist: [],
    pageNum: 1,
    hasMore: true
  }
  async componentDidMount() {
    let result = await test({key:'技术',pageNum: 1})
    let artlist = []
    if (result && result.data && result.data.articleArr.length>0) {
        artlist = result.data.articleArr
    }
    this.setState({
      artlist,
      hasMore: artlist.length == result.data.total? false: true
    })
  }
  async requestList () {
    let { artlist, pageNum } = this.state;
    pageNum+=1;
    let result = await test({key:'技术', pageNum })
    let list = []
    if (result && result.data && result.data.articleArr.length>0) {
       list = result.data.articleArr
    }
    this.setState({
      artlist: artlist.concat(list),
      pageNum,
      hasMore: list.length == 0? false: true
    })
  }
  render() {
    let { artlist, hasMore } = this.state;
    return (
      <>
        <CommonHead />
        <Header />
        <div style={{height: '80px'}}></div>
        <div className="technology">
        <InfiniteScroll
                    dataLength={artlist.length}
                    loader={<div style={{display:'flex',justifyContent:'center',alignContent:'center'}}>
                      <Spin />
                    </div>}
                    next={this.requestList.bind(this)}
                    hasMore={hasMore}
                    endMessage={
                      <p style={{ textAlign: 'center', color: '#00965e', fontSize: '12px' }}>
                        <span>暂无更多数据</span>
                      </p>
                    }
                    >
 {
               artlist? artlist.map(item => {
                 return <div className="art_item hvr-underline-from-center" key={item._id}>
                      <div className="left">
                        <h2 className="art_title">
                          <a target="_blank" href={`/detail?id=${item._id}`}>
                            <h4> {item.title}</h4>
                          </a>
                        </h2>
                        <div className="art_content">
                          <p>
                            {item.desc}
                          </p>
                        </div>
                        <div className="art_footer">
                          <span>
                            蚌埠张学友
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
                    </InfiniteScroll>
          {/* <QueueAnim 
          animConfig={{opacity:[1, 0],translateY:[0, -30]}}
          delay={500}>
            
          </QueueAnim> */}
        </div>
      </>
    )
  }
}

export default Home