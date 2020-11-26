import React, { useState } from 'react'
import { Collapse } from 'antd'
import Header from '../../components/header'
import Link from 'next/link'
import CommonHead from '../../components/commonHeader'
import QueueAnim from 'rc-queue-anim';
import './index.less'
import { queryPicture } from '../../utils/service'


const { Panel } = Collapse;
class MyLife extends React.Component {
  state = {
    picList: []
  }

  async componentDidMount() {
    let result = await queryPicture()
    let picList = []
    if (result && result.data && result.data[0].pictureList.length>0) {
       picList = result.data[0].pictureList
    }
    this.setState({
        picList
    })
  }

  render() {
    let { picList } = this.state;
    return (
      <>
        <CommonHead />
        <Header />
        <div style={{height: '80px'}}></div>
        <div className="my_life">
          <QueueAnim 
          animConfig={{opacity:[1, 0],translateY:[0, -30]}}
          delay={500}>
            {
               <div className="masonry">
                   {
                        picList? picList.map((item,index) => {
                            return <div className="item" key={index}>
                                <img  src={item} />
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

export default MyLife