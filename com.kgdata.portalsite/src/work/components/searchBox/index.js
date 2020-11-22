import React, {Fragment, useEffect , useState } from 'react';
import { Button, Input, Modal,Row,Col,Select } from 'antd';
import './index.scss'

const { Search } = Input;
const { Option } =  Select;

export function SearchBox(props) {

    return (
        <div className="search-box">
           <Row>
               <Col span={24}>
                   <Input.Group style={{display:'flex',width: '350px'}} compact>
                     <Select onChange={props.onChange} defaultValue={props.defaultValue}>
                        {
                            props.options.map(item =>{
                                return (
                                <Option value={item.value} key={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select> 
                    <Search placeholder="输入查询内容" onSearch={props.onSearch} enterButton />
                   </Input.Group>
               </Col>
           </Row>
        </div>
    )
}
