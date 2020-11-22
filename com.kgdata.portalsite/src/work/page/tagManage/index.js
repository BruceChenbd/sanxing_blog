import React from 'react';
import './index.scss';
import { Row,Tabs,Col,Button,Input,Table, Popconfirm, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import KGDQaLevelManage from '../../components/tagManageCategoryTable/index';
import { queryKeywordList, deleteInstance, deleteKeyword, queryInstanceList } from '../../server/index';
import style from '../../style/global.scss'
const { TabPane } = Tabs;
const { Search } = Input;

export default class TagManage extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            pageSize1: 10,
            pageSize2: 10,
            pageSize3: 1,
            instanceTotal: 0, // 实体总数
            keywordTotal: 0, // 关键词总数
            entityPage: 1,
            keyWordPage: 1,
            isAdd: false,
            keywordList: [], // 关键字列表数据
            instanceList: [], // 实体列表数据
            queryKeywordOpt: { // 查询条件
              size: 1,
              page: 1,
              keywordName: ''
            },
            queryInstanceOpt: { // 查询条件
                size: 1,
                page: 1,
                instanceName: ''
            }
        }
        this.changeEntityPageSize = this.changeEntityPageSize.bind(this)
        this.changeEntityPage= this.changeEntityPage.bind(this)
        this.changeKeywordPage = this.changeKeywordPage.bind(this)
        this.changeKeywordPageSize = this.changeKeywordPageSize.bind(this)
        this.showCallback = this.showCallback.bind(this)
        this.showCallback1 = this.showCallback1.bind(this)
    }
    componentDidMount() {
        // 关键字列表初始化
        queryKeywordList(this.state.queryKeywordOpt).then(res => {
            if(res.data.retCode == '00000' && res.data.data.data.length >0) {
                let list = res.data.data.data.map(item => {
                    return {...item,key: item.id}
                })
                this.setState({
                    keywordList: list,
                    keywordTotal: parseInt(res.data.data.total)
                })
            }
        })
        // 实体列表初始化
        queryInstanceList(this.queryInstanceOpt).then(res => {
            if(res.data.retCode == '00000' && res.data.data.data.length >0) {
                let list = res.data.data.data.map(item => {
                    return {...item, key: item.instanceId}
                })
                this.setState({
                    instanceList: list,
                    instanceTotal: parseInt(res.data.data.total)
                })
            }
        })
    }
    // tab切换
    changeTab(key) {
    }
    // 查询分类
    searchTypeByKey(val) {
    }
    // 查询关键字
    searchKeywordByKey(val) {
        this.setState({
            queryKeywordOpt: Object.assign({},this.state.queryKeywordOpt,{keywordName: val, page: 1}),
            keyWordPage: 1
        },() => {
            queryKeywordList(this.state.queryKeywordOpt).then(res => {
                if(res.data.retCode == '00000' && res.data.data.data.length >0) {
                    let list = res.data.data.data.map(item => {
                        return {...item,key: item.id}
                    })
                    this.setState({
                        keywordList: list,
                        keywordTotal: parseInt(res.data.data.total)
                    })
                } else {
                    this.setState({
                        keywordList: [],
                        keywordTotal: 0
                    })
                }
            })

        })
    }
    // 查询实体
    searchEntityByKey(val) {
        this.setState({
            entityPage: 1,
            queryInstanceOpt: Object.assign({},this.state.queryInstanceOpt,{instanceName: val, page: 1})
        },() => {
            queryInstanceList(this.state.queryInstanceOpt).then(res => {
                if(res.data.retCode == '00000' && res.data.data.data.length >0) {
                    let list = res.data.data.data.map(item => {
                        return {...item, key: item.instanceId}
                    })
                    this.setState({
                        instanceList: list,
                        instanceTotal: parseInt(res.data.data.total)
                    })
                } else {
                    this.setState({
                        instanceList: [],
                        instanceTotal:0
                    })
                }
            })

        })
    }
    // 实体分页页码改变
    changeEntityPageSize(current,pageSize) {
    }
    // 实体分页改变
    changeEntityPage(current,pageSize) {
    }
    // 关键字分页页码改变
    changeKeywordPageSize(current,pageSize) {
       
    }
    // 关键字分页改变
    changeKeywordPage(current,pageSize) {
     
    }
    // 增加分类
    addTag() {
        this.setState({
            isAdd: true
        })
    }
    showCallback() {
        this.setState({
            isAdd: false
        })
    }
    showCallback1() {
        this.setState({
            isAdd: true
        })
    }

    handleInstanceTable (filters, sorters) {
    this.setState({
        entityPage: filters.current,
        pageSize2: filters.pageSize,
        queryInstanceOpt: Object.assign({},this.state.queryInstanceOpt,{size: filters.pageSize, page: filters.current})
    }, ()=> {
        queryInstanceList(this.state.queryInstanceOpt).then(res => {
            if(res.data.retCode == '00000' && res.data.data.data.length >0) {
                let list = res.data.data.data.map(item => {
                    return {...item, key: item.instanceId}
                })
                this.setState({
                    instanceList: list,
                    instanceTotal: parseInt(res.data.data.total)
                })
            } else {
                this.setState({
                    instanceList: [],
                    instanceTotal: 0
                })
            }
        })
    })
    }
    handleKeywordTable (filters, sorters) {
        this.setState({
            keyWordPage: filters.current,
            pageSize1: filters.pageSize,
            queryKeywordOpt: Object.assign({},this.state.queryKeywordOpt,{size: filters.pageSize, page: filters.current})
        }, ()=> {
            queryKeywordList(this.state.queryKeywordOpt).then(res => {
                if(res.data.retCode == '00000' && res.data.data.data.length >0) {
                    let list = res.data.data.data.map(item => {
                        return {...item,key: item.id}
                    })
                    this.setState({
                        keywordList: list,
                        keywordTotal: parseInt(res.data.data.total)
                    })
                } else {
                    this.setState({
                        keywordList: [],
                        keywordTotal: 0
                    })
                }
            })
        })
    }

    // 删除关键字
    delKeyword (record) {
       let { keywordList } = this.state;
       deleteKeyword({keyWordId: record.id}).then(res => {
           if(res.data.retCode == '00000') {
               let index = keywordList.findIndex(item =>item.id == record.id);
               keywordList.splice(index,1)
               this.setState({
                   keywordList
               })
               message.success('删除成功')
           }else {
               message.error('删除失败')
           }
       })
    }
    // 删除实体
    delInstance (record) {
        let { instanceList } = this.state;
        deleteInstance({instanceId: record.instanceId}).then(res => {
            if(res.data.retCode == '00000') {
                let index = instanceList.findIndex(item =>item.instanceId == record.instanceId);
                instanceList.splice(index,1)
                this.setState({
                    instanceList
                })
                message.success('删除成功')
            }else {
                message.error('删除失败')
            }
        })
    }
    // 复制实体id
    copyInstanceId (val) {
       message.success('复制ID成功')
    }
    // 复制关键字id
    CopyKeyId (val) {
        message.success('复制ID成功')
    }
    render() {
        const keywordColumns = [
            {
                title: '关键字',
                dataIndex: 'keyWord',
                key: 'keyWord'
            },{
                title: '操作',
                key: 'action',
                width: 150,
                render: (text,record)=> {
                    return (
                        <div>
                            <CopyToClipboard
                             text={record.id}
                             onCopy={this.CopyKeyId}
                            >
                                <span style={{color: style.mainColor,cursor:'pointer'}}>复制ID</span>
                            </CopyToClipboard>
                            <Popconfirm
                                placement="top"
                                title={'确认要删除?'}
                                onConfirm={this.delKeyword.bind(this,record)}
                                okText="是"
                                cancelText="否">
                               <span style={{marginLeft: '10px',color:style.mainColor,cursor:'pointer'}}>删除</span>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
        const entityColumns = [
            {
                title: '实体',
                dataIndex: 'instanceName',
                key: 'instanceName'
            },{
                title: '操作',
                key: 'action',
                width: 150,
                render: (text,record)=> {
                    return (
                        <div>
                           <CopyToClipboard
                           text={record.InstanceId}
                           onCopy={this.copyInstanceId}
                           >
                              <span style={{color: style.mainColor,cursor:'pointer'}}>复制ID</span>
                           </CopyToClipboard>
                            <Popconfirm
                                placement="top"
                                title={'确认要删除?'}
                                onConfirm={this.delInstance.bind(this,record)}
                                okText="是"
                                cancelText="否">
                              <span style={{marginLeft: '10px',color: style.mainColor,cursor:'pointer'}}>删除</span>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]

        const keywordPagination = {
            pageSize: this.state.pageSize1,
            total: this.state.keywordTotal,
            current: this.state.keyWordPage,
            defaultPageSize: 1,
            size:'small',
            showSizeChanger:true, 
            showQuickJumper:true,
            onShowSizeChange: (current, pageSize)=> this.changeKeywordPageSize(pageSize, current),
            onChange:(current,pageSize) => this.changeKeywordPage(current,pageSize),
        }
        const entityPagination = {
            pageSize: this.state.pageSize2,
            total: this.state.instanceTotal,
            current: this.state.entityPage,
            defaultPageSize: 1,
            size:'small',
            showSizeChanger:true, 
            showQuickJumper:true,
            onShowSizeChange: (current, pageSize)=> this.changeEntityPageSize(pageSize, current),
            onChange:(current,pageSize) => this.changeEntityPage(current,pageSize),
        }
        return (
            <div className="tag-manage">
                <Tabs defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
                    <TabPane tab="分类" key="1">
                      <Row>
                          <Col span={24}>
                             <KGDQaLevelManage
                               show={this.state.isAdd}
                               showCallback={this.showCallback}
                               showCallback1 = {this.showCallback1}
                             ></KGDQaLevelManage>
                          </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab="关键字" key="2">
                      <Row>
                          <Col className="tag-list-title" span={12}>
                              <h2>关键字标签列表</h2>
                          </Col>
                          <Col className="tag-search-area" span={12}>
                              <Search
                                placeholder="关键字输入"
                                onSearch={this.searchKeywordByKey.bind(this)}
                                style={{ width: 200,float:'right',borderRadius:'0', marginLeft: '20px'}}
                                />
                          </Col>
                      </Row>
                      <Row style={{marginTop:'20px'}}>
                          <Col span={24}>
                               <Table 
                               size="small" 
                               columns={keywordColumns} 
                               dataSource={this.state.keywordList}
                               bordered={false}
                               pagination={keywordPagination}
                               onChange={this.handleKeywordTable.bind(this)}
                               >
                               </Table>
                          </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab="实体" key="3">
                      <Row>
                          <Col className="tag-list-title" span={12}>
                              <h2>实体标签列表</h2>
                          </Col>
                          <Col className="tag-search-area" span={12}>
                              <Search
                                placeholder="关键字输入"
                                onSearch={this.searchEntityByKey.bind(this)}
                                style={{ width: 200,float:'right',borderRadius:'0', marginLeft: '20px'}}
                                />
                          </Col>
                      </Row>
                      <Row style={{marginTop:'20px'}}>
                          <Col span={24}>
                               <Table 
                               size="small" 
                               columns={entityColumns} 
                               dataSource={this.state.instanceList}
                               bordered={false}
                               pagination={entityPagination}
                               onChange={this.handleInstanceTable.bind(this)}
                               >
                               </Table>
                          </Col>
                      </Row>
                    </TabPane>
                </Tabs>,
            </div>
        )
    }
}