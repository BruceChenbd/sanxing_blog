import React from 'react';
import { Table, Button, Tabs, Form, Switch, Col, Select, Input, Modal, Checkbox, Icon, message } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import SearchArea from '@components/searchArea/index'
import { getIrameList, deleteIframe, setVisible } from '../../server/index'


@inject('UserStore')
@observer
class VideoIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            total: 0,
            tableData: [
              
            ],
            visible: false,
            keyWord: '',
            previewInfo:null
        }
    }

    componentDidMount() {
        this.getArticleListFun('',1)
    }
    getArticleListFun = (key, pageNum) => {
        const param = {
            key, pageNum
        }
        getIrameList(param).then(res => {
            if (res.data.code == 0 && res.data.data.articleArr.length> 0) {
                let result = res.data.data.articleArr.map(item => {
                    return {
                        ...item,
                        key: item._id,
                        id: item._id,
                    }
                })

                this.setState({
                    tableData: result,
                    total: res.data.data.total,
                    page: pageNum
                })
            } else {
                this.setState({
                    tableData: [],
                    total: 0
                })
            }
        })
    }
    goAdd = () => {
        this.props.history.push('/DemoVideo-add')
    }
    goedit = (id) => {
        this.props.history.push(`/DemoVideo-edit/${id}`)
    }
    fetchResult = (key) => {
        this.setState({
            keyWord: key
        }, () => {
            this.getArticleListFun(key, 1)
        })
       
    }

    changePage = (current, pageSize) => {
        let { keyWord } = this.state;
        this.setState({
            page: current
        }, () => {
           this.getArticleListFun(keyWord, current)
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    lookDetail = (record) => {
        window.location.href = record.url
    }
    resetKey = () => {
        this.setState({
            keyWord: ''
        }, () => {
            this.getArticleListFun('', 1)
        })
    }
    del = (id) => {
        let { tableData, keyWord, page } = this.state;
        deleteIframe(id).then(res => {
            if (res.data.code == 0) {
                let index = tableData.findIndex(item => item.id == id);
                tableData.splice(index,1)
                this.setState({
                    tableData
                }, () => {
                    this.getArticleListFun(keyWord, 1)
                })
                message.success('删除成功!')
            } else {
                message.warn('删除失败！')
            }
        })
    }
    render() {
        const { page, total, tableData } = this.state;
        const columns = [
            {
                title: '视频标题',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    return <span title={record.title} style={{width: '100px', overflow: 'hidden', textOverflow:'ellipsis',
                    whiteSpace: 'nowrap', display: 'inline-block'}}>
                        {record.title}
                    </span>
                }
            }, {
                title: '视频地址',
                dataIndex: 'url',
                key: 'url',
                render: (text, record) => {
                    return <span title={record.url} style={{width: '100px', overflow: 'hidden', textOverflow:'ellipsis',
                    whiteSpace: 'nowrap', display: 'inline-block'}}>
                        {record.url}
                    </span>
                }
            }, {
                title: '操作',
                render: (text, record) => {
                    return <div>
                        <span onClick={() => this.lookDetail(record)} style={{ marginRight: '8px' }}><a>查看</a></span>
                        <span onClick={() => this.goedit(record.id)} style={{ marginRight: '8px' }}><a>编辑</a></span>
                        <span onClick={() => this.del(record.id)}><a>删除</a></span>
                    </div>
                }
            }
        ]
        const pagination = {
            total: total,
            current: page,
            pageSize: 5,
            size: 'small',
            onChange: (current, pageSize) => this.changePage(current, pageSize),
        }
        return (
            <div className="DemoVideo">
                <div className="action_header">
                    <Button onClick={this.goAdd} type="primary" icon="plus">添加</Button>
                    <SearchArea resetKey={this.resetKey} searchCallback={this.fetchResult} />
                </div>
                <div className="result_body">
                    <Table columns={columns} pagination={pagination} dataSource={tableData} />
                </div>
            </div>
        )
    }
}

export default Form.create()(VideoIndex)