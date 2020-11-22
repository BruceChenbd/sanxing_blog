import React from 'react';
import { Table, Button, Tabs, Form, Switch, Col, Select, Input, Modal, Checkbox, Icon, message } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import SearchArea from '@components/searchArea/index'
import { getArticleList, deleteArticle, setVisible } from '../../server/index'

const { TabPane } = Tabs;

@inject('UserStore')
@observer
class ProductIndex extends React.Component {
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
        getArticleList(param).then(res => {
            if (res.data.code == 0 && res.data.data.articleArr.length> 0) {
                let result = res.data.data.articleArr.map(item => {
                    return {
                        productName: item.title,
                        productImg: item.cover_image,
                        releaseTime: item.createTime,
                        isVisable: item.isVisable,
                        key: item._id,
                        id: item._id,
                        category: item.category,
                        content: item.content
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
        this.props.history.push('/ProductIndex-add')
    }
    goedit = (id) => {
        this.props.history.push(`/ProductIndex-edit/${id}`)
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
    onChangeCheck(record, val) {
        let { tableData } = this.state;
        let param = {
            id: record.id,
            isVisable: val
        }
        setVisible(param).then(res => {
            if(res.data.code == 0) {
                tableData.forEach(item => {
                    if (item.id == record.id) {
                        item.isVisable = val
                    }
                })
                this.setState({
                    tableData
                })
        
                message.success('设置成功！')
            }
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    lookDetail = (record) => {
        this.setState({
            previewInfo: record,
            visible: true
        })
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
        deleteArticle(id).then(res => {
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
        const { page, total, tableData, visible, previewInfo } = this.state;
        const columns = [
            {
                title: '标题',
                dataIndex: 'productName',
                key: 'productName',
                render: (text, record) => {
                    return <span style={{width: '100px', overflow: 'hidden', textOverflow:'ellipsis',
                    whiteSpace: 'nowrap', display: 'inline-block'}}>
                        {record.productName}
                    </span>
                }
            }, {
                title: '封面',
                dataIndex: 'productImg',
                key: 'productImg',
                render: (text, record) => {
                    return <img style={{ width: 100 }} src={record.productImg} alt="" />
                }
            }, {
                title: '分类',
                dataIndex: 'category',
                key: 'category'
            },{
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
            <div className="ProductIndex">
                <div className="action_header">
                    <Button onClick={this.goAdd} type="primary" icon="plus">添加文章</Button>
                    <SearchArea resetKey={this.resetKey} searchCallback={this.fetchResult} />
                </div>
                <div className="result_body">
                    <Table columns={columns} pagination={pagination} dataSource={tableData} />
                </div>
                <Modal className="product_modal"  title={'文章预览'} visible={visible} footer={null} onCancel={this.handleCancel}>
                   <div className="preview_article">
                       <h2 className="my_title">
                           {previewInfo?previewInfo.productName: ''}
                       </h2>
                       <p className="my_time">
                           {previewInfo? previewInfo.releaseTime: ''}
                       </p>
                       <p className="my_pic">
                           <img src={previewInfo? previewInfo.productImg: ''} />
                       </p>
                       <div className="dangerouslySetInnerHTML" dangerouslySetInnerHTML={{__html: previewInfo? previewInfo.content: ''}}>

                       </div>
                   </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(ProductIndex)