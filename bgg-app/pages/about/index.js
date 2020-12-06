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
          <p>
          “吾日三省吾身”出自《论语·学而》，意指每天多次反省自己、检视自己，发现自身缺点，弥补自身不足。本站三省也是由此而来，我希望在日常开发或者生活中，能记录有意义的问题和事情和大家分享，共同进步。
          </p>
            <p>
              QQ: 393591669
            </p>
            <p>
              掘金社区： <a href="https://juejin.cn/user/1626932941436535">https://juejin.cn/user/1626932941436535</a>
            </p>
           <p>
             github： <a href="https://github.com/BruceChenbd">
             https://github.com/BruceChenbd
             </a>
           </p>
           <p>
             有任何疑问或者技术交流，欢迎与我联系。
           </p>
        </div>
      </>
    )
  }
}

export default About