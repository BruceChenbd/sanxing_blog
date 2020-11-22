import React from 'react';
import { Table, Button, Tabs, Form, Row, Col, Select, Input, Modal, Upload, Icon } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { uploadCoverImg } from '../../server/index'
import BraftEditor from 'braft-editor';
import '../../style/braft.scss'

const { TabPane } = Tabs;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@inject('UserStore')
@observer
class AddNews extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isAdd: true,
            editorState: '', // 设置编辑器初始内容
            outputHTML: '<p></p>',
            previewVisible: false, // 图片预览
            previewImage: ''
        }
    }

    componentDidMount() {
        const param = this.props.history.location;
        if (param.query) {
            this.setState({
                isAdd: false
            })
        } else {
            this.setState({
                isAdd: true
            })
        }
    }

    uploadImg = (file) => {
        console.log(file)
        let fd = new FormData();
        fd.append('file', file.file);

        uploadCoverImg(fd)
            .then(res => {
                console.log(res, 'res')
                // if (res.data.data.status === 0) {
                //     const setFieldsValue = this.props.form.setFieldsValue;
                //     setFieldsValue({
                //         cover_image: [
                //             {
                //                 uid: Math.floor(Math.random() * 10e6),
                //                 url: res.data.data.data
                //             }
                //         ]
                //     });
                //     message.success(res.data.data.message);
                // }
            })
            .catch(err => console.log(err));
    };

    handleImageRemove = (file) => {
        const { getFieldValue, setFieldsValue } = this.props.form;
        let filterFiles = getFieldValue('cover_image').filter((d) => d.uid !== file.uid);

        setFieldsValue({
            cover_image: filterFiles
        });
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    };
    normImageFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values.prd_introduce.toHTML())
                // values.content = values.content.toHTML();
                // this.props.postArticle && this.props.postArticle(values);
            }
        });
    };
    render() {
        const { isAdd, previewVisible, previewImage } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        let initEditor;
        if (Object.keys({}).length == 0) {
            initEditor = '';
        } else {
            initEditor = BraftEditor.createEditorState(`${articleInfo.content}`)
        }
        return (
            <div className="AddNews">
                <div className="back_area">
                    <Icon style={{ fontSize: '16px', cursor: 'pointer' }} type="left" />
                    {
                        isAdd ? <h2>添加产品</h2> : <h2>编辑产品</h2>
                    }
                </div>
                <div className="editor_area">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label="新闻标题">
                            {getFieldDecorator('prd_name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入产品名称'
                                    }
                                ]
                            })(
                                <Input style={{ width: 400 }} autoComplete="off" placeholder="请输入产品名称" />
                            )}
                        </FormItem>
                        <FormItem label="封面图片">
                            {getFieldDecorator('cover_image', {
                                // initialValue: articleInfo.cover_image || [],
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normImageFile
                            })(
                                <Upload
                                    className="cover-image"
                                    listType="picture-card"
                                    customRequest={this.uploadImg}
                                    onRemove={this.handleImageRemove}
                                    onPreview={this.handlePreview}
                                >
                                    {uploadButton}
                                    {/* {getFieldValue('cover_image').length >= 1 ? null : uploadButton} */}
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem className="full" label="新闻摘要">
                            {getFieldDecorator('desc', {
                                // initialValue: articleInfo.desc,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入新闻摘要'
                                    },
                                    { max: 200, message: '新闻摘要长度不能大于200' }
                                ]
                            })(<TextArea style={{padding: '16px' }} rows={3} placeholder="新闻摘要" />)}
                        </FormItem>
                        <FormItem className="full" label="新闻内容">
                            {getFieldDecorator('prd_introduce', {
                                validateTrigger: 'onSbmit',
                                initialValue: initEditor,
                                rules: [{
                                    required: true,
                                    validator: (_, value, callback) => {
                                        if (value.isEmpty()) {
                                            callback('请输入新闻内容')
                                        } else {
                                            callback()
                                        }
                                    }
                                }],
                            })(
                                <BraftEditor
                                    className="my-editor"
                                    placeholder="新闻内容"

                                />
                            )}
                        </FormItem>
                        <FormItem className="mb-0" style={{ marginLeft: '109px' }}>
                            <Button type="primary" style={{ marginRight: 20 }}>
                                确定发布
                            </Button>
                            <Button htmlType="submit">
                                预览
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AddNews)