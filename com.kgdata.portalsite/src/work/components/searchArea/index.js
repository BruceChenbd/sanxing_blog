import React from 'react';
import {  Button, Form, Row, Col, Input} from 'antd';

const FormItem = Form.Item;

class SearchArea extends React.Component {
    constructor(props) {
        super(props)
    }


    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.searchCallback(values.title)
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
        this.props.resetKey()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} style={{ minWidth: 460 }}>
                <Row gutter={24}>

                    <Col span={14}>
                        <FormItem label="关键词">
                            {getFieldDecorator('title', {
                                initialValue: ''
                            })(<Input style={{ width: '200px' }} autoComplete="off" placeholder="搜索标题,分类" />)}
                        </FormItem>
                    </Col>

                    <Col span={8} style={{ textAlign: 'right', marginTop: '4px' }}>
                        <Button type="primary" htmlType="submit">
                            查询
                                    </Button>
                        <Button style={{
                            marginLeft: 8,
                        }} onClick={this.handleReset}>
                            重置
                                    </Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default Form.create()(SearchArea)