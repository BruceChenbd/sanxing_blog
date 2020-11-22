import React, { Component } from 'react';
import { Button, Col, Input, message, Popconfirm, Row, Table, Modal,Form } from 'antd';
import { queryClassfyTree, addClassify,deleteClassify, modifyClassify } from '../../server/index';
import style from '../../style/global.scss';
const { Search } = Input;

class KGDQaLevelManage extends Component {
  constructor() {
    super();
    this.state = {
      tableData: [], //列表展示数据源
      editRow: null, //编辑行
      expandedRowKeys:[],//展开行
      pageSize: 10, // 分页
      total: 0, // 分页总数
      visible: false, // 展示modal
      name: '', // 标签名称 新增
      addInfo: null, //新增标签信息
      editInfo: null, // 编辑标签信息
    };
    this.changeCateGoryPageSize = this.changeCateGoryPageSize.bind(this)
    this.changeCateGoryPage = this.changeCateGoryPage.bind(this)
    this.handleOk = this.handleOk.bind(this)
  }
  
  componentWillMount() {
    this.refurbish();
  }

  componentWillUpdate(nextProps, nextState,nextContext){
    if(nextProps.random!==this.props.random){
      this.refurbish();
    }
  }
  changeCateGoryPageSize = (current,pageSize) => {

  }
  changeCateGoryPage = (current,pageSize) => {
  }
  //刷新
  refurbish = () => {
      queryClassfyTree().then(res => {
        if(res.data.retCode == '00000' && res.data.data.length>0) {
            res.data.data.forEach(item => {
             this.getTree(item)
           })
           this.setState({tableData:res.data.data, total: res.data.length});
        } else {
           this.setState({tableData: [], total: 0});
        }
      })
  }
  // 树形数据转化为适应Tree组件
  getTree(data) {
    data.label = data.name; 
    data.children = data.children;
    data.key = data.id;
    data.id = data.id;
    if(data.children && data.children.length >0) {
        data.children.forEach(item => {
            this.getTree(item)
        })
    }
    return data
 }
  //添加新的分类
  funAddLevelInfo(levelInfos,parentId,levelInfo){
    if(parentId){
      for(let i=0;i<levelInfos.length;i++){
        if(levelInfos[i].id===parentId){
          if(!levelInfos[i].children){
            levelInfos[i].children=[];
          }
          // levelInfos[i].children.push(levelInfo);
          return;
        }
        if(levelInfos[i].children&&levelInfos[i].children.length>0){
          this.funAddLevelInfo(levelInfos[i].children,parentId,levelInfo);
        }
      }
    }else{
      // levelInfos.push(levelInfo);
    }
  }

  //编辑分类
  funEditLevelInfo(levelInfos,parentId,levelInfo){
    if(parentId) {
      for (let i = 0; i < levelInfos.length; i++) {
        if (levelInfos[i].id === parentId) {
          let index = levelInfos[i].children.findIndex(item => {
            return item.id === levelInfo.id
          });
          if (index !== -1) {
            levelInfos[i].children[index].label = levelInfo.label;
            levelInfos[i].children[index].lastModTime = levelInfo.lastModTime;
            levelInfos[i].children[index].edit = levelInfo.edit;
            return;
          }
        }
        if (levelInfos[i].children && levelInfos[i].children.length > 0) {
          this.funEditLevelInfo(levelInfos[i].children, parentId, levelInfo);
        }
      }
    }else{
      let index = levelInfos.findIndex(item => {
        return item.id === levelInfo.id
      });
      if (index !== -1) {
        levelInfos[index].label = levelInfo.label;
        levelInfos[index].lastModTime = levelInfo.lastModTime;
        levelInfos[index].edit = levelInfo.edit;
      }
    }
  }

  //删除分类
  funRemoveLevelInfo(levelInfos,id){
    for(let i=0;i<levelInfos.length;i++){
      if(levelInfos[i].id===id){
        levelInfos.splice(i,1);
        return;
      }
      if(levelInfos[i].children&&levelInfos[i].children.length>0){
        this.funRemoveLevelInfo(levelInfos[i].children,id);
      }
    }
  }


  //分类值变更
  funLevelChange=(levelInfo,event)=>{
    this.setState({
      name: event.target.value
    })
    let levelInfos = this.state.tableData;
    if(levelInfo.parentId){
      levelInfo.label=event.target.value;
      this.funEditLevelInfo(levelInfos,levelInfo.parentId,levelInfo);
      this.setState({tableData:levelInfos});
    }else{
      let index = levelInfos.findIndex(item=>{return item.id===levelInfo.id});
      if(index!==-1){
        levelInfos[index].label=event.target.value;
        this.setState({tableData:levelInfos});
      }
    }
  }

  //开启添加下一级分类
  funOpenAddLevel=(levelInfo)=>{
    this.setState({
      addInfo: levelInfo
    })
    if(this.state.editRow){
      message.warn("有正在编辑中的分类");
      return;
    }
    //  展示弹框
    this.setState({
      visible: true
    })
    let levelInfos = this.state.tableData;
    if(!levelInfos){
      levelInfos=[];
    }
    let {expandedRowKeys} = this.state;
    let newLevelInfo={
      id: Math.random().toString(36).substr(3,length),
      value: '',
      label: '',
      parentId:levelInfo?levelInfo.id:null,
      children: [],
    };
    this.funAddLevelInfo(levelInfos,newLevelInfo.parentId,newLevelInfo);
    if(levelInfo){
      let index = expandedRowKeys.findIndex(item=>{return item===levelInfo.id});
      if(index===-1) {
        expandedRowKeys.push(levelInfo.id);
      }
    }
    this.setState({expandedRowKeys:expandedRowKeys,levelInfo});
  }

  //分类信息保存
  funSaveLevel=(levelInfo)=>{
    let levelInfos = this.state.tableData;
    let editRow = this.state.editRow;
    const obj = {
      classificationId: editRow.id,
      name: this.state.name || editRow.label,
      lastModTime: levelInfo.lastModTime
    }

    modifyClassify(obj).then(res => {
      let newData = res.data.data;
      newData.edit = false;
      newData.label = newData.name;
      if(res.data.retCode == '00000') {
          this.funEditLevelInfo(levelInfos,levelInfo.parentId, newData);
          this.setState({tableData:levelInfos,editRow:null});
          message.success("修改成功");
      } else {
        message.warn('修改失败')
      }
    })
  }

  //分类信息编辑撤销
  funEditLevelCancel=(levelInfo)=>{
    this.setState({
      editInfo: levelInfo
    })
    let levelInfos = this.state.tableData;
    let editRow = this.state.editRow;
    if(editRow.id){
      levelInfo.label = editRow.label;
      levelInfo.edit = false;
      this.funEditLevelInfo(levelInfos,levelInfo.parentId,levelInfos);
      this.setState({tableData:levelInfos,editRow:null});
    }else{
      this.funRemoveLevelInfo(levelInfos,levelInfo.id);
      this.setState({tableData:levelInfos,editRow:null});
    }
  }

  //开启分类信息编辑
  funOpenEditLevel=(levelInfo)=>{
    if(this.state.editRow){
      message.warn("有正在编辑中的分类");
      return;
    }
    let levelInfos = this.state.tableData;
    let editRow = {
      id:levelInfo.id,
      value:levelInfo.value,
      label:levelInfo.label,
      parentId:levelInfo.parentId,
    };
    levelInfo.edit = true;
    this.funEditLevelInfo(levelInfos,levelInfo.parentId,levelInfo);
    this.setState({tableData:levelInfos,editRow:editRow});
  }

  //分类信息删除
  funDelete=(levelInfo)=>{
    deleteClassify({classificationId: levelInfo.classificationId}).then(res => {
      if(res.data.retCode == '00000') {
        this.funRemoveLevelInfo(this.state.tableData, levelInfo.classificationId)
        this.setState({
          tableData: this.state.tableData
        },() => {
        })
      }
    })
  }

  //点击行展开
  funOnExpand=(id)=>{
    let {expandedRowKeys} = this.state;
    let index = expandedRowKeys.findIndex(item=>{return item===id});
    if(index===-1){
      expandedRowKeys.push(id);
    }else{
      expandedRowKeys.splice(index,1);
    }
    this.setState({expandedRowKeys:expandedRowKeys});
  }
  // 新增保存
  handleOk = () => {
    this.props.form.validateFields((err,values)=> {
        if(err) {
          return
        }
        const obj = {};
        if(this.state.addInfo == null) {
          obj.name = values.cateGoryTag
        } else {
          const currentId = this.state.addInfo.id;
          obj.parentId = currentId;
          obj.name = values.cateGoryTag;
        }

        addClassify(obj).then(res => {
          if(res.data.retCode == '00000') {
            this.addClassifyRecursion(this.state.tableData, res.data.data.parentId, res.data.data)
            message.success('添加成功')
            this.setState({
              visible: false
            })
          } else {
            message.error('添加失败')
          }
        })
      })
   
  }
  // 添加分类 递归
  addClassifyRecursion(levelInfos,parentId,levelInfo){
    if(parentId){
      for(let i=0;i<levelInfos.length;i++){
        if(levelInfos[i].id===parentId){
          if(!levelInfos[i].children){
            levelInfos[i].children=[];
          }
          levelInfos[i].children.push({
            ...levelInfo,
            label: levelInfo.name,
            key: levelInfo.id
          });
          return;
        }
        if(levelInfos[i].children&&levelInfos[i].children.length>0){
          this.addClassifyRecursion(levelInfos[i].children,parentId,levelInfo);
        }
      }
    }else{
      levelInfos.push({
        ...levelInfo,
        label: levelInfo.name,
        key: levelInfo.id
      });
    }
  }
  // 根据子节点查找父节点
  treeFindPath (tree, func, path = []) {
    if (!tree) return []
    for (const data of tree) {
      // 这里按照你的需求来存放最后返回的内容吧
      path.push(data.id)
      if (func(data)) return path
      if (data.children) {
        const findChildren = this.treeFindPath(data.children, func, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  }
  
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  // 搜索
  searchTypeByKey = (val) => {
    if(val) {
      let filterArr =  this.rebuildData(val, this.state.tableData);
      this.setState({
        tableData: filterArr
      })
    } else {
      queryClassfyTree().then(res => {
        if(res.data.retCode == '00000' && res.data.data.length>0) {
          res.data.data.forEach(item => {
           this.getTree(item)
         })
         this.setState({tableData:res.data.data, total: res.data.length});
        } else {
          this.setState({tableData: [], total: 0});
        }
      })
    }
   
  }
  // 模糊查询
  rebuildData = (value, arr) => {
    let newarr = [];
    arr.forEach(element => {
      if (element.name.indexOf(value) > -1) {
        newarr.push(element);
      } else {
        if (element.children && element.children.length > 0) {
          const ab = this.rebuildData(value, element.children);
          const obj = {
            ...element,
            children: ab
          };
          if (ab && ab.length>0) {
            newarr.push(obj);
          }
        }
      }
    });
    return newarr;
  }
  // 表格改变
  handleTable (filters) {
    this.setState({
      pageSize: filters.pageSize
    })
  }
  render() {
    const { tableData ,expandedRowKeys} = this.state;
    const { getFieldDecorator } = this.props.form
    const tableColumn = [
      {
        title: '分类',
        key: 'label',
        render: (record) => {
          if (record.edit) {
            return <Input value={record.label} style={{ width: 240 }} onChange={this.funLevelChange.bind(this,record)}/>;
          }
          return (
            <span style={{cursor: 'pointer',marginLeft:20}} onClick={this.funOnExpand.bind(this,record.id)}>{record.label}</span>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        render: record => {
          if (record.edit) {
            return <div>
              <a onClick={this.funSaveLevel.bind(this,record)} style={{color: style.mainColor}}>保存</a>
              <Popconfirm
                placement="top"
                title={'是否撤销编辑?'}
                onConfirm={this.funEditLevelCancel.bind(this,record)}
                okText="是"
                cancelText="否">
                <a style={{marginLeft:10,color: style.mainColor}}>撤销</a>
              </Popconfirm>
            </div>;
          }

          return (
            <div>
              <a onClick={this.funOpenAddLevel.bind(this,record)} style={{color: style.mainColor}}>添加子分类</a>
              <a onClick={this.funOpenEditLevel.bind(this,record)} style={{marginLeft:10,color: style.mainColor}}>编辑</a>
              <Popconfirm
                placement="top"
                title={'是否删除该分类信息?'}
                onConfirm={this.funDelete.bind(this,record)}
                okText="是"
                cancelText="否">
                <a style={{marginLeft:10,color: style.mainColor}}>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const cateGoryPagination = {
        pageSize: this.state.pageSize,
        total: this.state.total,
        defaultPageSize: 1,
        size:'small',
        showSizeChanger:true, 
        showQuickJumper:true,
        onShowSizeChange: (current, pageSize)=> this.changeCateGoryPageSize(pageSize, current),
        onChange:(current,pageSize) => this.changeCateGoryPage(current,pageSize),
    }

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Row>
        <Row span={24}>
            <Col className="tag-list-title" span={12}>
                <h2>分类标签列表</h2>
            </Col>
            <Col className="tag-search-area" span={12}>
                <Search
                  placeholder="关键字输入"
                  onSearch={this.searchTypeByKey.bind(this)}
                  style={{ width: 200,float:'right',borderRadius:'0', marginLeft: '20px'}}
                  />
              <Button onClick={this.funOpenAddLevel.bind(this,null)} style={{float:'right',backgroundColor: style.mainColor, border: 'none', borderRadius: '0',color:'#fff'}}>
                    添加
              </Button>
            </Col>
        </Row>
        <Col span={24} style={{ paddingTop: 10 }}>
          <Table
            rowKey={record => (record.id)}
            columns={tableColumn}
            // expandedRowKeys={expandedRowKeys}
            dataSource={tableData}
            onExpand={(expanded, record)=>this.funOnExpand(record.id)}
            onChange={this.handleTable.bind(this)}
            size="small"
            pagination={cateGoryPagination}
          />
        </Col>
        <Modal
          title="添加分类"
          className="tag-manage-modal"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel}
        >
          <Form
          {...layout}
          >
            <Form.Item
            label="分类名称"
            >
                {getFieldDecorator('cateGoryTag', {
                    rules: [{ required: true, message: '请输入分类名称!' }],
                })(
                    <Input
                    id="tagChange"
                    />,
                )}
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    );
  }
}

export default Form.create()(KGDQaLevelManage);
