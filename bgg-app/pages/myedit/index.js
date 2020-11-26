import React, { useState } from 'react'
import { Collapse } from 'antd'
import Header from '../../components/header'
import Link from 'next/link'
import CommonHead from '../../components/commonHeader'
import QueueAnim from 'rc-queue-anim';
import './index.less'
import { queryFrameList } from '../../utils/service'


const { Panel } = Collapse;
class MyEdit extends React.Component {
  state = {
    frameList: []
  }
  async componentDidMount() {
    let result = await queryFrameList()
    let frameList = []
    if (result && result.data && result.data.articleArr.length>0) {
      frameList = result.data.articleArr
    }
    this.setState({
        frameList
    })
  }

  render() {
    let { frameList } = this.state;
    return (
      <>
        <CommonHead />
        <Header />
        <div style={{height: '80px'}}></div>
        <div className="my_edit">
          <QueueAnim 
          animConfig={{opacity:[1, 0],translateY:[0, -30]}}
          delay={500}>
            {
               <div className="my_edit_list">
                   {
                        frameList? frameList.map((item,index) => {
                            return <div className="item" key={index}>
                                <iframe scrolling="no" border="0" frameBorder="no" framespacing="0" allowFullScreen={true} width="100%" src={item.url}></iframe>
                                <h2>
                                    {item.title}
                                </h2>
                            </div>
                        }): <div>暂无数据</div>
                   }
               </div>
            }
          </QueueAnim>
        </div>
      </>
    )
  }
}

export default MyEdit