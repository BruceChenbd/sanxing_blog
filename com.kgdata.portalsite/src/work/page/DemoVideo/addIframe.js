import React from 'react';
import { message, Button, Tabs, Form, Row, Col, Select, Input, Modal, Upload, Icon } from 'antd';
import './index.scss';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import { saveFrameUrl, editFrameUrl, uploadEditImg, queryIframeDetail, updateArticle } from '../../server/index'
import BraftEditor from 'braft-editor';
import '../../style/braft.scss'
import { getTimestampStr } from '../../../utils/KGUtils'

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@inject('UserStore')
@observer
class AddIframe extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAdd: true,
            editorState: '', // 设置编辑器初始内容
            outputHTML: '<p></p>',
            previewVisible: false, // 图片预览
            previewImage: '',
            fileList:[], // 编辑器上传图片数组
            isPreviewEditUrl: false, // 编辑器上传图片预览
            editImgUrl: '', // 编辑器上传图片预览的url
            isPreviewArticle: false, // 文章预览
            previewArticleInfo: null, // 文章预览信息
            articleInfo: null, // 编辑文章信息
            eidtId: '', // 编辑的文章id
        }
    }

    componentDidMount() {
        const param = this.props.match.params;
        if (param.id) {
            this.setState({
                isAdd: false,
                eidtId: param.id
            })
            queryIframeDetail(param.id).then(res => {
                if (res.data.code == 0 && res.data.data.length> 0) {
                   this.setState({
                     articleInfo: res.data.data[0]
                   }, () => {
                       console.log(this.state.articleInfo)
                   })
                }
            })
        } else {
            this.setState({
                isAdd: true
            })
        }
    }

    handleSubmit = (e) => {
        const { eidtId, articleInfo,isAdd  } = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const param = {
                    id: eidtId? eidtId: '',
                    title: values.title,
                    url: values.url
                }
                if (isAdd) {
                    saveFrameUrl(
                        param
                    ).then(res => {
                        if (res.data.code == 0) {
                            message.success('新增视频成功！')
                            this.props.history.push('/DemoVideo')
                        }
                    })
                } else {
                    editFrameUrl(
                        param
                    ).then(res => {
                        if (res.data.code == 0) {
                            message.success('更新视频成功！')
                            this.props.history.push('/DemoVideo')
                        }
                    })
                }
            }
        });
    };
    previewArticle = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                window.location.href = values.url
            }
        });
    }
    render() {
        const { isAdd, articleInfo  } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="AddIframe">
                <div className="back_area">
                    <Link to="/DemoVideo" style={{lineHeight: 1}}>
                       <Icon style={{ fontSize: '20px', cursor: 'pointer', color: 'black' }} type="left" />
                    </Link>
                    {
                        isAdd ? <h2>添加Iframe</h2> : <h2>编辑Iframe</h2>
                    }
                </div>
                <div className="editor_area">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label="视频标题">
                            {getFieldDecorator('title', {
                                initialValue: articleInfo? articleInfo.title: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入视频标题'
                                    }
                                ]
                            })(
                                <Input style={{ width: 400 }} autoComplete="off" placeholder="请输入视频标题" />
                            )}
                        </FormItem>
                        <FormItem label="视频地址">
                            {getFieldDecorator('url', {
                                initialValue: articleInfo? articleInfo.url: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入视频地址'
                                    }
                                ]
                            })(
                                <Input style={{ width: 400 }} autoComplete="off" placeholder="请输入视频地址" />
                            )}
                        </FormItem>
                        <FormItem className="mb-0" style={{ marginLeft: '109px' }}>
                            <Button htmlType="submit" type="primary" style={{ marginRight: 20 }}>
                                确定发布
                            </Button>
                            <Button onClick={this.previewArticle}>
                                预览
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(AddIframe)