import React from 'react';
import { Table, Button, Tabs, Form, Switch, Col, Select, Input, Modal, Checkbox, Icon } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import SearchArea from '@components/searchArea/index'

const { TabPane } = Tabs;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@inject('UserStore')
@observer
class KnowledgeIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            total: 0,
            tableData: [
                {
                    documentName: '《知识图谱标准化白皮书》（2019版）',
                    abstract: '文档摘要文档摘要文档摘要文档摘要',
                    releaseTime: '2020-9-4',
                    isVisable: true,
                    key: 1,
                    id: 1
                }, {
                    documentName: '《知识图谱标准化白皮书》（2019版）',
                    abstract: '文档摘要文档摘要文档摘要文档摘要',
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
        this.props.history.push('/KnowledgeIndex-add')
    }
    goedit = (id) => {
        this.props.history.push({
            pathname: 'KnowledgeIndex-edit',
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
                title: '文档标题',
                dataIndex: 'documentName',
                key: 'documentName'
            }, {
                title: '摘要',
                dataIndex: 'abstract',
                key: 'abstract'
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
            <div className="KnowledgeIndex">
                <div className="action_header">
                    <Button onClick={this.goAdd} type="primary" icon="plus">添加文档</Button>
                    <SearchArea searchCallback={this.fetchResult} />
                </div>
                <div className="result_body">
                    <Table columns={columns} pagination={pagination} dataSource={tableData} />
                </div>
                {/* <Modal
                    title="预览"
                    visible={this.state.visible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="product_modal"
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="首页" key="1">
                            <div className="productTab">
                                <div className="productWord">
                                    <h2>知识图谱</h2>
                                    <div>
                                        是柯基数据开发的图谱构建、运维一体化平台，提供从数据到知识的全方位服务。在平台可以实现结构化、半结构化、非结构化的多源异构数据的知识获取，基于动态的本体构建技术，实现基于本体的数据融合，在平台中以实体、关系、属性的方式进行存储与管理，提供图挖掘计算、知识的图谱化展示、基于图谱的智能问答等服务。
                                    </div>
                                </div>
                                <div className="productImg">
                                    <img src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg" alt="" />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="产品页" key="2">
                            <div className="product_page">
                                <h2 className="product_page_title">产品介绍</h2>
                                <div>

                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal> */}
            </div>
        )
    }
}

export default Form.create()(KnowledgeIndex)