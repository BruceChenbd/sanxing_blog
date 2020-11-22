import React from 'react';
import { message, Button, Tabs, Form, Row, Col, Select, Input, Modal, Upload, Icon } from 'antd';
import './index.scss';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import { uploadArticleImg, addArticle, uploadEditImg, getArticleInfo, updateArticle } from '../../server/index'
import BraftEditor from 'braft-editor';
import '../../style/braft.scss'
import { getTimestampStr } from '../../../utils/KGUtils'

const { TabPane } = Tabs;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@inject('UserStore')
@observer
class AddProduct extends React.Component {
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
            getArticleInfo(param.id).then(res => {
                if (res.data.code == 0 && res.data.data.length> 0) {
                   this.setState({
                     articleInfo: Object.assign({},res.data.data[0], { cover_image: [
                        {
                            uid: Math.floor(Math.random() * 10e6),
                            url: res.data.data[0].cover_image
                        }
                    ]})
                   }, () => {
                   })
                }
            })
        } else {
            this.setState({
                isAdd: true
            })
        }
    }

    uploadImg = (file) => {
        let fd = new FormData(), that = this;
        fd.append('file', file.file);
        
        uploadArticleImg(fd)
            .then(res => {
                if (res.status === 200 && res.data.data && res.data.data.status == 0) {
                    const setFieldsValue = that.props.form.setFieldsValue;
                    setFieldsValue({
                        cover_image: [
                            {
                                uid: Math.floor(Math.random() * 10e6),
                                url: res.data.data.data
                            }
                        ]
                    });
                    message.success('上传成功!');
                } else {
                    message.warn(res.data.data.message)
                }
            })
            .catch(err => console.log(err));
    };
    uploadEditImg = (file) => {
        let { fileList } = this.state;
        let fd = new FormData(), that = this;
        fd.append('file', file.file);
        
        uploadEditImg(fd)
            .then(res => {
                if (res.status === 200 && res.data.data && res.data.data.status == 0) {
                    fileList = fileList.concat({
                        uid: Math.floor(Math.random() * 10e6),
                        url: res.data.data.data
                    })
                    this.setState({
                        fileList
                    })
                    message.success('上传成功!');
                } else {
                    message.warn(res.data.data.message)
                }
            })
            .catch(err => console.log(err));
    }
    handleImageRemove = (file) => {
        const { getFieldValue, setFieldsValue } = this.props.form;
        let filterFiles = getFieldValue('cover_image').filter((d) => d.uid !== file.uid);
        setFieldsValue({
            cover_image: filterFiles
        });
    };
    handleImageRemoveEditImg = (file) => {
        let { fileList } = this.state;
        const index = fileList.findIndex(item => item.uid == file.uid)
        fileList.splice(index, 1)
        this.setState({
            fileList
        })
    }
    handleCancel = () => this.setState({ previewVisible: false, isPreviewEditUrl: false, isPreviewArticle: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    };
    handlePreviewEdit = (file) => {
        this.setState({
            isPreviewEditUrl: true,
            editImgUrl: file.url || file.thumbUrl
        })
    }
    normImageFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    handleSubmit = (e) => {
        const { eidtId, articleInfo,isAdd  } = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const param = {
                    id: eidtId? eidtId: '',
                    category: values.category,
                    content: values.content.toHTML(),
                    desc: values.desc,
                    title: values.title,
                    cover_image: values.cover_image[0].url,
                    isVisable: articleInfo? articleInfo.isVisable: true
                }
                if (isAdd) {
                    addArticle(
                        param
                    ).then(res => {
                        if (res.data.code == 0) {
                            message.success('新增文章成功！')
                            this.props.history.push('/ProductIndex')
                        }
                    })
                } else {
                    updateArticle(
                        param
                    ).then(res => {
                        if (res.data.code == 0) {
                            message.success('更新文章成功！')
                            this.props.history.push('/ProductIndex')
                        }
                    })
                }
            }
        });
    };
    previewArticle = () => {
        const time = (new Date()).getTime()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const param = {
                    category: values.category,
                    content: values.content.toHTML(),
                    desc: values.desc,
                    title: values.title,
                    cover_image: values.cover_image[0].url,
                    createTime: getTimestampStr(time)
                }
                this.setState({
                    isPreviewArticle: true,
                    previewArticleInfo: param
                })
            }
        });
    }
    render() {
        const { isAdd, previewVisible, previewImage, fileList, isPreviewEditUrl, 
            editImgUrl, isPreviewArticle, previewArticleInfo, articleInfo
         } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        // 编辑器集成
        const controls = [
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'media',
            'separator',
            'clear'
        ]
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        // 编辑器图片上传
        const extendControls = [
            {
              key: 'antd-uploader',
              type: 'component',
              component: (
                <Upload
                className="cover-image"
                fileList={fileList}
                listType="picture-card"
                customRequest={this.uploadEditImg}
                onRemove={this.handleImageRemoveEditImg}
                onPreview={this.handlePreviewEdit}
            >
               {uploadButton}
            </Upload>
              )
            }
        ]
       
       
        let initEditor;
        if (!articleInfo) {
            initEditor = '';
        } else {
            initEditor = BraftEditor.createEditorState(`${articleInfo.content}`)
        }
        return (
            <div className="AddProduct">
                <div className="back_area">
                    <Link to="/ProductIndex" style={{lineHeight: 1}}>
                       <Icon style={{ fontSize: '20px', cursor: 'pointer', color: 'black' }} type="left" />
                    </Link>
                    {
                        isAdd ? <h2>添加文章</h2> : <h2>编辑文章</h2>
                    }
                </div>
                <div className="editor_area">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label="分类">
                            {getFieldDecorator('category', {
                                initialValue: articleInfo? articleInfo.category: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择文章分类'
                                    }
                                ]
                            })(
                              <Select style={{width: 400}} showArrow>
                                <Option value="技术">技术</Option>
                                <Option value="杂谈">杂谈</Option>
                              </Select>
                            )}
                        </FormItem>
                        <FormItem label="标题">
                            {getFieldDecorator('title', {
                                initialValue: articleInfo? articleInfo.title: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入文章标题'
                                    }
                                ]
                            })(
                                <Input style={{ width: 400 }} autoComplete="off" placeholder="请输入文章标题" />
                            )}
                        </FormItem>
                        <FormItem label="封面">
                            {getFieldDecorator('cover_image', {
                                initialValue: articleInfo?  articleInfo.cover_image : [],
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normImageFile,
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传文章封面'
                                    }
                                ]
                            })(
                                <Upload
                                    className="cover-image"
                                    listType="picture-card"
                                    customRequest={this.uploadImg}
                                    onRemove={this.handleImageRemove}
                                    onPreview={this.handlePreview}
                                >
                                    {getFieldValue('cover_image') && getFieldValue('cover_image').length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem className="full" label="文章简介">
                            {getFieldDecorator('desc', {
                                initialValue:articleInfo?  articleInfo.desc: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入文章简介'
                                    },
                                    { max: 200, message: '简介长度不能大于200' }
                                ]
                            })(<TextArea style={{padding: '16px' }} rows={3} placeholder="文章简介" />)}
                        </FormItem>
                        <FormItem className="full" label="主体内容">
                            {getFieldDecorator('content', {
                                validateTrigger: 'onSbmit',
                                initialValue: initEditor,
                                rules: [{
                                    required: true,
                                    validator: (_, value, callback) => {
                                        if (value.isEmpty()) {
                                            callback('请输入文章主体内容')
                                        } else {
                                            callback()
                                        }
                                    }
                                }],
                            })(
                                <BraftEditor
                                    className="my-editor"
                                    placeholder="文章主体内容"
                                    controls={controls}
                                    extendControls={extendControls}
                                />
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
                <Modal  title={'图片预览'} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Modal  title={`请复制  ${editImgUrl}`} visible={isPreviewEditUrl} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={editImgUrl} />
                </Modal>
                <Modal className="product_modal"  title={'文章预览'} visible={isPreviewArticle} footer={null} onCancel={this.handleCancel}>
                   <div className="preview_article">
                       <h2 className="my_title">
                           {previewArticleInfo?previewArticleInfo.title: ''}
                       </h2>
                       <p className="my_time">
                           {previewArticleInfo? previewArticleInfo.createTime: ''}
                       </p>
                       <p className="my_pic">
                           <img src={previewArticleInfo? previewArticleInfo.cover_image: ''} />
                       </p>
                       <div className="dangerouslySetInnerHTML" dangerouslySetInnerHTML={{__html: previewArticleInfo? previewArticleInfo.content: ''}}>

                       </div>
                   </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AddProduct)