import React from 'react';
import { Upload, Button, message, Form, Switch, Col, Select, Input, Modal, Checkbox, Icon } from 'antd';
import './index.scss';
import { observer, inject } from 'mobx-react';
import { uploadPicture, saveImgList, queryImgs } from '../../server/index'


@inject('UserStore')
@observer
class JobIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList:[],
            previewVisible: false,
            previewImage: ''
        }
    }

    componentDidMount() {
        queryImgs().then(res => {
            if (res.data.code == 0 && res.data.data.length > 0 && res.data.data[0].pictureList.length>0) {
                let result = res.data.data[0].pictureList.map(item => {
                    return {
                        uid: Math.floor(Math.random() * 10e6),
                        url: item
                    }
                })
                this.setState({
                    fileList: result
                })
            } else {
                this.setState({
                    fileList: []
                })
            }
        })
    }
    uploadImg = (file) => {
        let { fileList } = this.state;
        let fd = new FormData(), that = this;
        fd.append('file', file.file);
        
        uploadPicture(fd)
            .then(res => {
                if (res.status == 200 && res.data.data && res.data.data.status == 0) {
                console.log(res)

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
    };

    handleImageRemove = (file) => {
       let { fileList } = this.state;
       let index = fileList.findIndex(item => item.uid == file.uid)
       fileList.splice(index, 1)
       this.setState({
           fileList
       })
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
    saveImgs = () => {
        const { fileList } = this.state;
        let pictureList = fileList.map(item => item.url)
        saveImgList(pictureList).then(res => {
            console.log(res)
            if (res.data.code == 0) {
                message.success(res.data.message)
            } else {
                message.warn('保存失败！')
            }
        })
    }
    render() {
        const { fileList, previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="Picture_box">
                <div>
                <Upload
                    className="cover-image"
                    listType="picture-card"
                    fileList={fileList}
                    customRequest={this.uploadImg}
                    onRemove={this.handleImageRemove}
                    onPreview={this.handlePreview}
                >
                    {uploadButton}
                </Upload>
                </div>
                <div>
                    <Button disabled={fileList.length>0? false: true} onClick={this.saveImgs} type="primary">保存</Button>
                </div>
                <Modal  title={'图片预览'} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(JobIndex)