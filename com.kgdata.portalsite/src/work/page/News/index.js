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
class NewsIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            total: 0,
            tableData: [
                {
                    newsTitle: '创聚工程”和“创业南京”的高科技企业',
                    newsAbstract: '创聚工程”和“创业南京”的高科技企业',
                    coverImg: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                    releaseTime: '2020-9-4',
                    key: 1,
                    id: 1
                }, {
                    newsTitle: '创聚工程”和“创业南京”的高科技企业',
                    newsAbstract: '创聚工程”和“创业南京”的高科技企业',
                    coverImg: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
                    releaseTime: '2020-9-4',
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
        this.props.history.push('/NewsIndex-add')
    }
    goedit = (id) => {
        this.props.history.push({
            pathname: 'NewsIndex-edit',
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
                title: '新闻标题',
                dataIndex: 'newsTitle',
                key: 'newsTitle'
            }, {
                title: '新闻摘要',
                dataIndex: 'newsAbstract',
                key: 'newsAbstract'
            }, {
                title: '封面图片',
                dataIndex: 'coverImg',
                key: 'coverImg',
                render: (text, record) => {
                    return <img style={{ width: 20 }} src={record.coverImg} alt="" />
                }
            }, {
                title: '发布时间',
                dataIndex: 'releaseTime',
                key: 'releaseTime'
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
            <div className="NewsIndex">
                <div className="action_header">
                    <Button onClick={this.goAdd} type="primary" icon="plus">添加新闻</Button>
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
                   <div className="new_preview">
                        <h3 className="new_title">新闻标题</h3>
                        <p className="new_date">2020-9-7</p>
                        <div className="new_body">
                            南京柯基数据科技有限公司是“创聚工程”和“创业南京”的高科技企业，已获得授权及在申请的发明专利9项，软著12个等核心自主知识产权，技术覆盖从数据采集到数据清洗、知识提取、知识表现、知识推理、动态本体建模存储、关联分析、可视化、问答系统、语义检索等知识图谱全技术链。2017年在北京中关村成立了北京知识图谱科技有限公司，负责公司的产品、市场推广及售前售后运维服务等。

                            结合各领域的业务应用场景总结开发了通用的知识图谱技术平台，把较复杂的技术通过工程开发变得更易操作，目前已经完成该平台的整体开发工作并在实际落地项目中不断地更新迭代，下一步公司计划通过多领域的应用完善技术平台，打造一个可在不同行业快速复制的知识图谱引擎，大大减少行业知识图谱的实施成本，加快各行业智能应用的构建速度，然后开始产品国际化做英文数据的处理。



                        </div>
                   </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(NewsIndex)