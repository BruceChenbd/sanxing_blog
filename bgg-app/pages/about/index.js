import React, { useState } from 'react'
import Header from '../../components/header'
import CommonHead from '../../components/commonHeader'
import QueueAnim from 'rc-queue-anim';
import './index.less'


class About extends React.Component {
  state = {
   
  }
  componentDidMount() {
  
  }

  render() {
    let { frameList } = this.props;
    console.log(frameList)
    return (
      <>
        <CommonHead />
        <Header />
        <div style={{height: '80px'}}></div>
        <div className="about">
          <QueueAnim 
          animConfig={{opacity:[1, 0],translateY:[0, -30]}}
          delay={500}>
             <h2>
                是你得不到的男人
             </h2>
          </QueueAnim>
        </div>
      </>
    )
  }
}

export default About