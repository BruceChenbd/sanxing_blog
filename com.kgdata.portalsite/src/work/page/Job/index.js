import React from 'react';
import { Table, Button, Tabs, Form, Switch, Col, Select, Input, Modal, Checkbox, Icon } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import SearchArea from '@components/searchArea/index'
import boss from '../../images/boss.png'


@inject('UserStore')
@observer
class JobIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            total: 0,
            tableData: [
                {
                    jobName: '前端开发工程师',
                    hireNum: 5,
                    releaseTime: '2020-9-4',
                    isVisable: true,
                    key: 1,
                    id: 1
                }, {
                    jobName: 'JAVA开发工程师',
                    hireNum:  10,
                    releaseTime: '2020-9-4',
                    isVisable: true,
                    key: 2,
                    id: 2
                },
            ],
            visible: false
        }
    }

    componentDidMount() {

    }

    goAdd = () => {
        this.props.history.push('/JobIndex-add')
    }
    goedit = (id) => {
        this.props.history.push({
            pathname: 'JobIndex-edit',
            query: {
                id
            }
        })
    }
    fetchResult = (key) => {
        console.log(key)
    }

    changePage = (current, pageSize) => {
        this.setState({
            page: current
        })
    }
    onChangeCheck(record, val) {
        let { tableData } = this.state;
        tableData.forEach(item => {
            if (item.id == record.id) {
                item.isVisable = val
            }
        })
        this.setState({
            tableData
        })

    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    lookDetail = () => {
        this.setState({
            visible: true
        })
    }
    render() {
        const { page, total, tableData } = this.state;
        const columns = [
            {
                title: '职位名称',
                dataIndex: 'jobName',
                key: 'jobName'
            }, {
                title: '招聘人数',
                dataIndex: 'hireNum',
                key: 'hireNum'
            }, {
                title: '发布时间',
                dataIndex: 'releaseTime',
                key: 'releaseTime'
            }, {
                title: '是否可见',
                dataIndex: 'isVisable',
                key: 'isVisable',
                render: (text, record) => {
                    return <Switch checkedChildren="是" unCheckedChildren="否" checked={record.isVisable} onChange={this.onChangeCheck.bind(this, record)} />
                }
            }, {
                title: '操作',
                render: (text, record) => {
                    return <div>
                        <span onClick={this.lookDetail} style={{ marginRight: '8px' }}><a>查看</a></span>
                        <span onClick={() => this.goedit(record.id)} style={{ marginRight: '8px' }}><a>编辑</a></span>
                        <span><a>删除</a></span>
                    </div>
                }
            }
        ]
        const pagination = {
            total: total,
            current: page,
            pageSize: 10,
            size: 'small',
            onChange: (current, pageSize) => this.changePage(current, pageSize),
        }
        return (
            <div className="JobIndex">
                <div className="action_header">
                    <Button onClick={this.goAdd} type="primary" icon="plus">添加职位</Button>
                    <SearchArea searchCallback={this.fetchResult} />
                </div>
                <div className="result_body">
                    <Table columns={columns} pagination={pagination} dataSource={tableData} />
                </div>
                <Modal
                    title="预览"
                    visible={this.state.visible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="product_modal"
                >
                 <div className="job_preview">
                     <div className="job_detail">
                        <h4 className="job_name">nlp开发工程师</h4>
                        <h3 className="title">岗位职责：</h3>
                        <div>

                        </div>
                        <h3 className="title">岗位要求：</h3>
                        <div>
                            
                        </div>
                     </div>
                     <div className="job_img">
                         <img src={boss} alt=""/>
                         <div className="tip">
                             <span>微信扫一扫</span>
                             <span>投递简历</span>
                         </div>
                     </div>
                 </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(JobIndex)