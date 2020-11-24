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
   
  }
  static async getInitialProps() {
      let result = await queryPicture()
      console.log(result,'result')
      let picList = []
      if (result && result.data && result.data[0].pictureList.length>0) {
         picList = result.data[0].pictureList
      }
      return {
        picList
      }
  }
  componentDidMount() {
    // queryList().then(res => {
    //   console.log(res)
    // })
  }

  render() {
    let { picList } = this.props;
    console.log(picList)
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
                            return <div className="item">
                                <img key={index} src={item} />
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