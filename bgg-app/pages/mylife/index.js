import React, { useState } from 'react'
import { Spin } from 'antd'
import Header from '../../components/header'
import Link from 'next/link'
import CommonHead from '../../components/commonHeader'
import QueueAnim from 'rc-queue-anim';
import './index.less'
import { queryPicture } from '../../utils/service'


class MyLife extends React.Component {
  state = {
    picList: [],
    isLoading: true
  }

  async componentDidMount() {
    let result = await queryPicture()
    let picList = []
    if (result && result.data && result.data[0].pictureList.length>0) {
       picList = result.data[0].pictureList
    }
    this.setState({
        picList,
        isLoading: false
    })
  }

  render() {
    let { picList, isLoading } = this.state;
    return (
      <>
        <CommonHead />
        <Header />
        <div style={{height: '80px'}}></div>
        <>
          {
            isLoading?  <div style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
            <Spin />
          </div>:   <div className="my_life">
          <QueueAnim 
          animConfig={{opacity:[1, 0],translateY:[0, -30]}}
          delay={500}>
            {
               <div className="masonry">
                   {
                        picList? picList.map((item,index) => {
                            return <div className="item hvr-grow-shadow" key={index}>
                                <img  src={item} />
                            </div>
                        }): <div>暂无数据</div>
                   }
               </div>
            }
          </QueueAnim>
        </div>
          } 
        </>
      
      </>
    )
  }
}

export default MyLife