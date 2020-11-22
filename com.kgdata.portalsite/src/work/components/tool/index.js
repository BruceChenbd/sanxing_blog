import React, {Component} from 'react';
import {Icon, Tooltip} from "antd";
import styles from "./style.css"
import style from '../../style/global.scss'

class Tool extends Component {

  clear() {
    if (this.props.clearFunc) {
      this.props.clearFunc();
    }
  }

  graphScaleTo(ratio) {
    if (this.props.graphScaleToFunc) {
      this.props.graphScaleToFunc(ratio);
    }
  }

  render() {
    let {contentHeight} = this.props;
    return <div className={`${styles.graph_toolbar} graph-toolbar`} style={{display:'inline-block',width:'auto'}}>

      <div style={{marginBottom: 20}}>
        <Tooltip placement={"left"} title={"放大"}>
          <div style={{width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: 'center', border:  `1px solid ${style.mainColor}`, borderRadius: '50%'}} className={styles.graph_toolbar_button} onClick={this.graphScaleTo.bind(this, 0.1)}>
            <Icon type="plus" style={{fontSize: 16, cursor: "pointer"}}/>
          </div>
        </Tooltip>
      </div>
      <div style={{marginBottom: 20}}>
        <Tooltip placement={"left"} title={"缩小"}>
          <div className={styles.graph_toolbar_button} style={{width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: 'center', justifyContent: 'center', border:  `1px solid ${style.mainColor}`, borderRadius: '50%'}}  onClick={this.graphScaleTo.bind(this, -0.1)}>
            <Icon type="minus" style={{fontSize: 16, cursor: "pointer"}}/>
          </div>
        </Tooltip>
      </div>
      <div style={{marginBottom: 20, display: this.props.clearFunc ? "block" : "none"}}>
        <Tooltip placement={"left"} title="清空">
          <div className={styles.graph_toolbar_button}>
            <Icon type="reload" style={{fontSize: 16, cursor: "pointer"}} onClick={this.clear.bind(this)}/>
          </div>
        </Tooltip>
      </div>
    </div>
  }
}

export default Tool;
