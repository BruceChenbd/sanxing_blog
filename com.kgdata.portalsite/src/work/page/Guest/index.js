import React from 'react';
import { Table, Button, Tabs, Form, Select, Col, Input, Modal, Switch, Icon } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import SearchArea from '@components/searchArea/index'
import * as XLSX from 'xlsx';

const Option = Select.Option;

@inject('UserStore')
@observer
class GuestIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            total: 0,
            tableData: [
                {
                    guestName: '张学友',
                    phone: '1888888888',
                    email: '99999999@qq.com',
                    unitName: '国防部',
                    industry: '军事',
                    isF: '是',
                    releaseTime: '2020-9-4',
                    intention: '了解知识图谱',
                    key: 1,
                    id: 1
                }, {
                    guestName: '张学友',
                    phone: '1888888888',
                    email: '99999999@qq.com',
                    unitName: '国防部',
                    industry: '军事',
                    isF: '是',
                    releaseTime: '2020-9-4',
                    intention: '了解知识图谱',
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
        this.props.history.push('/ProductIndex-add')
    }
    goedit = (id) => {
        this.props.history.push({
            pathname: 'ProductIndex-edit',
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
    handleChange = () => {

    }
    // 导出
    handleExportAll = (e) => {
        const entozh = {
            "key":"编号",
            "id":"id",
            "guestName": "姓名",
            "phone": "手机号",
            "email": "电子邮箱",
            "unitName": "单位名称",
            "industry": "所在行业",
            "isF": "是否期望回访",
            "releaseTime": "申请时间",
            "intention": "咨询意向",
        }

        const nowdata = this.state.tableData;

        const json = nowdata.map((item) => {
            return Object.keys(item).reduce((newData, key) => {
                const newKey = entozh[key]
                newData[newKey] = item[key]
                return newData
            }, {})
        });


        const sheet = XLSX.utils.json_to_sheet(json);

        this.openDownloadDialog(this.sheet2blob(sheet, undefined), `客户申请列表.xlsx`);

    }
    // 打开下载框
    openDownloadDialog = (url, saveName) => {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
    // 生成excl
    sheet2blob = (sheet, sheetName) => {
        sheetName = sheetName || 'sheet1';
        var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

        var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        }); // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        return blob;
    }
    render() {
        const { page, total, tableData } = this.state;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'guestName',
                key: 'guestName'
            }, {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone'
            }, {
                title: '电子邮箱',
                dataIndex: 'email',
                key: 'email'
            }, {
                title: '单位名称',
                dataIndex: 'unitName',
                key: 'unitName'
            }, {
                title: '所在行业',
                dataIndex: 'industry',
                key: 'industry'
            }, {
                title: '是否期望回访',
                dataIndex: 'isF',
                key: 'isF'
            }, {
                title: '申请时间',
                dataIndex: 'releaseTime',
                key: 'releaseTime'
            }, {
                title: '咨询意向',
                dataIndex: 'intention',
                key: 'intention',
            }, {
                title: '操作',
                render: (text, record) => {
                    return <div>
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
            <div className="GuestIndex">
                <div className="action_header">
                    <Button onClick={this.handleExportAll} type="primary" icon="plus">导出数据</Button>
                    <Switch style={{ position: 'absolute', right: 500, top: 10 }} checkedChildren="期望" unCheckedChildren="不期望" defaultChecked />
                    <SearchArea searchCallback={this.fetchResult} />
                </div>
                <div className="result_body">
                    <Table columns={columns} pagination={pagination} dataSource={tableData} />
                </div>
            </div>
        )
    }
}

export default Form.create()(GuestIndex)