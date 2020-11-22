import React from 'react';
import { Table, Button, Tabs, Form, Switch, Col, Select, Input, Modal, Checkbox, Icon } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import SearchArea from '@components/searchArea/index'

const { TabPane } = Tabs;

@inject('UserStore')
@observer
class ResolveIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            total: 0,
            tableData: [
                {
                    resolveName: '知识图谱',
                    releaseTime: '2020-9-4',
                    isVisable: true,
                    key: 1,
                    id: 1
                }, {
                    resolveName: '智能问答',
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
        this.props.history.push('/ResolveIndex-add')
    }
    goedit = (id) => {
        this.props.history.push({
            pathname: 'ResolveIndex-edit',
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
                title: '解决方案名称',
                dataIndex: 'resolveName',
                key: 'resolveName'
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
            <div className="ResolveIndex">
                <div className="action_header">
                    <Button onClick={this.goAdd} type="primary" icon="plus">添加解决方案</Button>
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
                    <div className="product_page">
                        <h2 className="product_page_title">产品介绍</h2>
                        <div>

                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default Form.create()(ResolveIndex)