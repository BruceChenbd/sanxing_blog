import React from 'react';
import './index.scss';
import { Icon, Badge, Tabs, Table, Switch , Tooltip, message } from 'antd';
import { SearchBox } from '../../components/searchBox/index';
import ReactEchart from 'echarts-for-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { queryRelationGraph, EsSearch, GraphExtends, queryAttr, MostShortSearch } from '../../server/index';
import styles from '../../style/global.scss'

const { TabPane } = Tabs;
export default class Test extends React.Component {
    constructor(props) {
        super(props)
        this.ChartRef = React.createRef();
        this.state = {
            defaultValue: '-1',
            graphType: '',
            keyWord: '',
            hasNext: true,
            graphPage: 1,
            page: 1, // 默认第一页
            selectNode: '',
            searchBoxArr: [
                {
                    value: '-1',
                    label: '全部图谱'
                },
                {
                    value: '1',
                    label: '文档图谱'
                },
                {
                    value: '2',
                    label: 'QB图谱'
                },
                {
                    value: '3',
                    label: '百科图谱'
                }
            ],
            result: [

            ],
            clickCount: 0,
            queryList: [],
            userId: '',
            graphData: {
                nodes: [],
                links: [],
            },
            visible: false,
            wrapStyle: {
                position: 'absolute',
                width: '100px',
                padding: '5px 0',
                backgroundColor: '#fff',
            },
            addSource: '',
            clickNodes: [], // 点击过的node节点
            shrink: [], // 再次点击收缩节点
            originNodeId: 'a9464fe71aae43e093a525ef4126fc64',//原节点id
            resultList: [
            
            ], // 搜索结果
            relationData: [
                
            ], // 关系过滤表格数据
            typeData: [
               
            ], // 类型过滤表格数据
            originData: [
              
            ], // 来源过滤表格数据
            isShowRelation: false,
            isShowPath: false,
            shortData: [
                
            ], // 路径分许表格数据
            relationCondition:[], // 关系过滤条件
            typeCondition: [], // 类型过滤条件
            originCondition: [], // 来源过滤条件
            shortCondition: [], // 最短路径分析
            attrData: [
               
            ],
            isShowTb: true, // 默认展示属性信息
            selectedRowKeys: [], // 最短路径选中行关键字
            selectedRows:[], // 最短路径选中行
            selectedRowKeysRelation: [], // 关系过滤选中行关键字
            selectedRowsRelation:[], // 关系过滤选中行
            selectedRowKeysType: [], // 类型选中行关键字
            selectedRowsType:[], // 类型选中行
            selectedRowKeysOrigin: [], // 来源选中行关键字
            selectedRowsOrigin:[], // 来源选中行
            isFresh: true,
            option : {
                tooltip: {
                    show: true,
                    formatter: "<div style='display:block;word-break: break-all;word-wrap: break-word;white-space:pre-wrap;max-width: 80px'>" + "{b} " + "</div>"
                },
                animationDurationUpdate: 2000,
                animationEasingUpdate: 'quinticInOut',
                legend: [{
                    data: [
                        {
                            name: '文档图谱',
                            color:  {
                                "type":"radial",
                                "x":0.5,
                                "y":0.5,
                                "r":0.5,
                                "colorStops":[
                                    {
                                        "offset":0,
                                        "color":"#B6E3F5"
                                    },
                                    {
                                        "offset":1,
                                        "color":"#5B8FF9"
                                    }
                                ],
                                "global":false
                            }
                        },
                        {
                            name: '百科图谱',
                            color:  {
                                "type":"radial",
                                "x":0.5,
                                "y":0.5,
                                "r":0.5,
                                "colorStops":[
                                    {
                                        "offset":0,
                                        "color":"#AAD8D8"
                                    },
                                    {
                                        "offset":1,
                                        "color":"#5AD8A6"
                                    }
                                ],
                                "global":false
                            }
                        },
                        {
                            name: 'QB图谱',
                            color: {
                                "type":"radial",
                                "x":0.5,
                                "y":0.5,
                                "r":0.5,
                                "colorStops":[
                                    {
                                        "offset":0,
                                        "color":"#FFD8B8"
                                    },
                                    {
                                        "offset":1,
                                        "color":"#F6BD16"
                                    }
                                ],
                                "global":false
                            }
                        }
                    ].map(x => x.name),
                    icon: 'circle',
                    right: 100,
                    bottom: 50,
                    itemWidth: 20,
                    itemHeight: 20,
                    textStyle: {
                        color: '#fff'
                    }
                }],
                series: [{
                    type: 'graph',
                    layout: 'force',
                    symbolSize: (value, param) => {
                        if (param.data.isBig) {
                            return 50
                        } else {
                            return 35
                        }
                    },
                    draggable: true,
                    roam: true,
                    focusNodeAdjacency: true,
                    edgeSymbol: ['', 'arrow'],
                    cursor: 'pointer',
                    categories: [
                        {
                            name: '文档图谱',
                            color:  {
                                "type":"radial",
                                "x":0.5,
                                "y":0.5,
                                "r":0.5,
                                "colorStops":[
                                    {
                                        "offset":0,
                                        "color":"#B6E3F5"
                                    },
                                    {
                                        "offset":1,
                                        "color":"#5B8FF9"
                                    }
                                ],
                                "global":false
                            }
                        },
                        {
                            name: '百科图谱',
                            color:  {
                                "type":"radial",
                                "x":0.5,
                                "y":0.5,
                                "r":0.5,
                                "colorStops":[
                                    {
                                        "offset":0,
                                        "color":"#AAD8D8"
                                    },
                                    {
                                        "offset":1,
                                        "color":"#5AD8A6"
                                    }
                                ],
                                "global":false
                            }
                        },
                        {
                            name: 'QB图谱',
                            color: {
                                "type":"radial",
                                "x":0.5,
                                "y":0.5,
                                "r":0.5,
                                "colorStops":[
                                    {
                                        "offset":0,
                                        "color":"#FFD8B8"
                                    },
                                    {
                                        "offset":1,
                                        "color":"#F6BD16"
                                    }
                                ],
                                "global":false
                            }
                        }
                    ].map(item => {
                        return {
                            name: item.name,
                            itemStyle: {
                                color: item.color
                            }
                        }
                    }),
                    emphasis: {
                        itemStyle: {
                            borderWidth: 10,
                            borderType: 'solid',
                            shadowBlur: 20,
                            shadowColor: '#eee',
                        },
                        label: {
                            show: true,
                            formatter: (record) => {
                                if (record.name.length > 10) {
                                    return record.name.substr(0, 5) + '...'
                                } else {
                                    return record.name
                                }
                            }
                        },
                        edgeLabel: {
                            width: 100
                        }
                    },
                    edgeLabel: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 14,
                                color: '#fff'
                            },
                            formatter(x) {
                                return x.data.name;
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'bottom',
                        color: '#fff',
                        formatter: (record) => {
                            console.log(record)
                            if (record.name.length > 10) {
                                return record.name.substr(0, 5) + '...'
                            } else {
                                return record.name
                            }
                        }
                    },
                    force: {
                        initLayout: 'circular',
                        repulsion: 80,
                        gravity: 0.01,
                        edgeLength: 180,
                        layoutAnimation: true,
                        friction: 0.2
                    },
                    data: [],
                    links: []
                }]
            }
        }
    }
    componentDidMount() {
        // queryRelationGraph({ entity_id: this.state.originNodeId }).then(res => {
        //     let nodes = res.data.data.nodes;
        //     if (nodes && nodes.length > 0) {
        //         nodes = nodes.map(item => {
        //             if (item.id !== this.state.originNodeId) {
        //                 return { ...item, category: '来源1', source: '来源1', sourceId: '123456', labels: this.state.originNodeId }
        //             } else {
        //                 return { ...item, category: '来源2', source: '来源2', sourceId: '1234567', labels: 'origin' }
        //             }
        //         })
        //     }
        //     let links = res.data.data.links;

        //     if (links && links.length > 0) {
        //         links = links.map(item => {
        //             return { ...item, name: item.ooName, labels: this.state.originNodeId }
        //         })
        //     }
        //     res.data.data.links = links;
        //     res.data.data.nodes = nodes;

        //     let relations = links.map(item => {
        //         return {ooName: item.ooName, ooId: item.ooId, id: item.ooId, key: item.ooId}
        //     })
        //     // 关系过滤table数据源
        //     let obj = {};
        //     relations = relations.reduce((pre,cur) => {
        //         obj[cur.id]? '': obj[cur.id] = true && pre.push(cur)
        //         return pre
        //     },[])
        //     // 类型过滤
        //     let types = nodes.map(item => {
        //         return {typeName: item.ooName, ooId: item.ooId, id: item.ooId, key: item.ooId}
        //     })

        //     let objType = {};
        //     types = types.reduce((pre,cur) => {
        //         objType[cur.id]? '': objType[cur.id] = true && pre.push(cur)
        //         return pre
        //     },[])

        //     // 来源过滤
        //     let origins = nodes.map(item => {
        //         return { originName: item.source, id: item.sourceId, key: item.sourceId }
        //     })
        //     let objOrigin = {};
        //     origins = origins.reduce((pre, cur) => {
        //         objOrigin[cur.id]? '': objOrigin[cur.id] = true && pre.push(cur)
        //         return pre
        //     },[])
        //     this.setState({
        //         graphData: res.data.data,
        //         relationData: relations,
        //         typeData: types,
        //         originData: origins,
        //         clickNodes: [this.state.originNodeId]
        //     })
        // })
        const that = this;
        this.ChartRef.current.echartsElement.oncontextmenu = () => {
            return false
        }
        this.ChartRef.current.echartsElement.onclick = function () {
            that.setState({
                visible: false
            })
        }
    }

    changeSearch = (val) => {
        const { graphType } = this.state;
        if (val == '') {
            return;
        }
        this.setState({
            keyWord: val
        })
        EsSearch ({
            graphType,
            keyWord: val.trim(),
            page: 1,
            size: 20
        }).then(res => {
            if (res && res.data.retCode == '00000' && res.data.data.list && res.data.data.list.length > 0) {
                let result = res.data.data.list.map(item => {
                    return { name: item.name, type: item.ooName, id: item.id, origin: this.state.searchBoxArr.find(s => s.value == item.graphType).label, graphType: item.graphType}
                })
                this.setState({
                    resultList: result,
                    hasNext: res.data.data.hasNext
                })
            } else {
                this.setState({
                    resultList: [],
                    hasNext: false
                })
            }
        })
    }

    changeSelect = (val) => {
       this.setState({
          graphType: val == '-1'? '': val,
          page: 1
       })
    }

    // 样式调整
    setStyle(data) {
        var arr = [
            {
                name: '文档图谱',
                color:  {
                    "type":"radial",
                    "x":0.5,
                    "y":0.5,
                    "r":0.5,
                    "colorStops":[
                        {
                            "offset":0,
                            "color":"#B6E3F5"
                        },
                        {
                            "offset":1,
                            "color":"#5B8FF9"
                        }
                    ],
                    "global":false
                }
            },
            {
                name: '百科图谱',
                color:  {
                    "type":"radial",
                    "x":0.5,
                    "y":0.5,
                    "r":0.5,
                    "colorStops":[
                        {
                            "offset":0,
                            "color":"#AAD8D8"
                        },
                        {
                            "offset":1,
                            "color":"#5AD8A6"
                        }
                    ],
                    "global":false
                }
            },
            {
                name: 'QB图谱',
                color: {
                    "type":"radial",
                    "x":0.5,
                    "y":0.5,
                    "r":0.5,
                    "colorStops":[
                        {
                            "offset":0,
                            "color":"#FFD8B8"
                        },
                        {
                            "offset":1,
                            "color":"#F6BD16"
                        }
                    ],
                    "global":false
                }
            }
        ]
        arr.forEach(item => {
            data.nodes.forEach(n => {
                if(n.category == item.name) {
                    n.itemStyle = {
                        color: item.color
                    }
                }
            })
        })
        // data.nodes.forEach(item => {
        //     if (item.color) {
        //         item.label = {
        //             color: item.color,
        //             fontWeight: 'bold'
        //         }
        //     }
        // })
        data.links.forEach(link => {
            link.lineStyle = {
                curveness: link.linknum * 0.1,
                color: link.linkColor? 'red': '#fff'
            }
            link.label = {
                align: 'center',
                fontSize: 12,
            };
        });
    }
    filterData = (graphData) => {
        const { shrink } = this.state

        let nodes = graphData.nodes;
        let links = graphData.links;

        if (shrink.length > 0) {
            for (let i in shrink) {
                nodes = nodes.filter(function (d) {
                    return d.labels.indexOf(shrink[i]) == -1;
                });
                links = links.filter(function (d) {
                    return d.labels.indexOf(shrink[i]) == -1;
                });
            }
        }
        graphData.nodes = nodes;
        graphData.links = links;
    }

    onclick = {
        'click': this.clickEchartsPie.bind(this),
        'dblclick': this.dblclickPie.bind(this),
        'contextmenu': this.rightMouse.bind(this),
        
    }
    clickEchartsPie(e) {
        if (e.dataType !== 'node') {
            return
        }
        queryAttr({
            instanceId: e.data.id,
            graphType: e.data.graphType
        }).then(res => {
            if (res.data.retCode == '00000' && res.data.data.properties && res.data.data.properties.length >0) {
               let result = res.data.data.properties.map(item => {
                   return {
                       attrName: item.ooName,
                       attrValue: item.value,
                       id: item.id,
                       key: item.id
                   }
               })
               this.setState({
                   attrData: result
               })
            }
        })
    }
    dblclickPie(e) {
        let that = this;
        if (e.dataType !== 'node') {
            return
        }
        let { graphData, clickNodes, shrink, graphPage, originData } = this.state;
        let echartInstance = this.ChartRef.current.getEchartsInstance();
        if (clickNodes.includes(e.data.id)) {
            if (shrink.includes(e.data.id)) {
                let index = shrink.findIndex(item => item == e.data.id);
                shrink.splice(index, 1)
            } else {
                shrink.push(e.data.id)
            }
            this.setState({ shrink }, () => {
                // this.filterData(graphData);
                let nodes = graphData.nodes;
                let links = graphData.links;
        
                if (that.state.shrink.length > 0) {
                    for (let i in that.state.shrink) {
                        nodes = nodes.filter(function (d) {
                            return d.labels.indexOf(that.state.shrink[i]) == -1;
                        });
                        links = links.filter(function (d) {
                            return d.labels.indexOf(that.state.shrink[i]) == -1;
                        });
                    }
                }
                this.setStyle({nodes, links})
                echartInstance.setOption({
                    series: {
                        data: nodes,
                        links: links
                    }
                })
            })
        } else {
            clickNodes.push(e.data.id)
            GraphExtends({
                instanceId: e.data.id,
                graphType:  e.data.graphType,
                page: 1,
                size: 10
            }).then(res => {
                let selectNode = e.data;
                this.setState({
                    selectNode
                })
                let nodes = res.data.data.nodes;
                if (nodes && nodes.length > 0) {
                    nodes = nodes.map(item => {
                        return { ...item, category: this.state.searchBoxArr.find(s => s.value == item.graphType).label, source: this.state.searchBoxArr.find(s => s.value == item.graphType).label, sourceId: item.graphType,  labels: selectNode.labels + ',' + selectNode.id }
                    })
                }
                let links = res.data.data.links;
                if (links && links.length > 0) {
                    links = links.map(item => {
                        return { ...item, name: item.ooName, labels: selectNode.labels + ',' + selectNode.id }
                    })
                }
                res.data.data.links = links;
                res.data.data.nodes = nodes;


                let oldNodes = graphData.nodes;
                let oldLinks = graphData.links;

                let newNodes = nodes;
                let newLinks = links;



                oldNodes = oldNodes.concat(newNodes);
                let nodeObj = {}
                oldNodes = oldNodes.reduce((pre, next) => {
                    nodeObj[next.id] ? "" : nodeObj[next.id] = true && pre.push(next)
                    return pre;
                }, [])

                oldLinks = oldLinks.concat(newLinks)
                let linksObj = {};
                oldLinks = oldLinks.reduce((pre, next) => {
                    linksObj[next.id] ? "" : linksObj[next.id] = true && pre.push(next)
                    return pre;
                }, [])
                this.linkMark(oldLinks);
                let relations = oldLinks.map(item => {
                    return {ooName: item.ooName, ooId: item.ooId, id: item.ooId, key: item.ooId}
                })
                // 关系过滤table数据源
                let obj = {};
                relations = relations.reduce((pre,cur) => {
                    obj[cur.id]? '': obj[cur.id] = true && pre.push(cur)
                    return pre
                },[])

                 // 类型过滤
                let types = nodes.map(item => {
                    return {typeName: item.ooName, ooId: item.ooId, id: item.ooId, key: item.ooId}
                })

                let objType = {};
                types = types.reduce((pre,cur) => {
                    objType[cur.id]? '': objType[cur.id] = true && pre.push(cur)
                    return pre
                },[])

                // 来源过滤
                let origins = nodes.map(item => {
                    return { originName: item.source, id: item.sourceId, key: item.sourceId }
                })
                let objOrigin = {};
                origins = origins.concat(originData)
                origins = origins.reduce((pre, cur) => {
                    objOrigin[cur.id]? '': objOrigin[cur.id] = true && pre.push(cur)
                    return pre
                },[])
               
                
                this.setState({
                    graphData: Object.assign({}, graphData, { nodes: oldNodes, links: oldLinks }),
                    clickNodes,
                    graphPage,
                    typeData: types,
                    originData: origins,
                    relationData: relations,
                }, () => {
                    this.filterData(this.state.graphData);
                    this.setStyle(this.state.graphData)
                    echartInstance.setOption({
                        series: {
                            data: this.state.graphData.nodes,
                            links: this.state.graphData.links
                        }
                    })
                })
            })
        }
    }
    // 对links重复的关系进行打标
    linkMark = (links) => {
        let linkGroup = {};
        //对连接线进行统计和分组，不区分连接线的方向，只要属于同两个实体，即认为是同一组
        let linkmap = {};
        for (let i = 0; i < links.length; i++) {
          if (typeof links[i].source == "string" || typeof links[i].target
            == "string") {
            var key = links[i].source < links[i].target ? links[i].source + ':'
              + links[i].target : links[i].target + ':' + links[i].source;
          } else {
            var key = links[i].source.id < links[i].target.id ? links[i].source.id
              + ':' + links[i].target.id : links[i].target.id + ':'
              + links[i].source.id;
          }
          if (!linkmap.hasOwnProperty(key)) {
            linkmap[key] = 0;
          }
          linkmap[key] += 1;
          if (!linkGroup.hasOwnProperty(key)) {
            linkGroup[key] = [];
          }
          linkGroup[key].push(links[i]);
        }
        for (let i = 0; i < links.length; i++) {
          if (typeof links[i].source == "string" || typeof links[i].target == "string") {
            var key = links[i].source < links[i].target ?
              links[i].source + ':' + links[i].target
              :
              links[i].target + ':' + links[i].source;
          } else {
            var key = links[i].source.id < links[i].target.id ? links[i].source.id
              + ':' + links[i].target.id : links[i].target.id + ':'
              + links[i].source.id;
          }
          links[i].size = linkmap[key];
          // 同一组的关系进行编号
          let group = linkGroup[key];
          // 给节点分配编号
          setLinkNumber(group);
        }
        function setLinkNumber(group) {
          if (group.length == 0) {
            return;
          }
          if (group.length == 1) {
            group[0].linknum = 0;
            return;
          }
          group.forEach((item, index) => {
             item.linknum = index
          })
          // let maxLinkNumber = group.length % 2 == 0 ? group.length / 2
          //   : (group.length - 1) / 2;
          // console.log(maxLinkNumber,'maxLinkNumber')
          // let startLinkNum = -maxLinkNumber;
          // for (let i = 0; i < group.length; i++) {
          //   group[i].linknum = startLinkNum++;
          // }
        }
    }
    rightMouse(e) {
        if (e.dataType != 'node') {
            return;
        }
        let { wrapStyle, graphData } = this.state;
        let event = e.event.event;
        const pageX = event.pageX - 20;
        const pageY = event.pageY;

        this.setState({
            wrapStyle: Object.assign({}, wrapStyle, { left: pageX + 'px', top: pageY + 'px' }),
            visible: true,
            graphData,
            addSource: e.data
        })
    }

    clickMenu(e) {
        let { addSource, shortData } = this.state;
        if (e.target.innerHTML == '添加关注点') {
           shortData = shortData.concat({
               attentionInstance: addSource.name,
               type: addSource.ooName,
               key: addSource.id,
               id: addSource.id,
               graphType: addSource.graphType
           })

           this.setState({
              shortData,
              visible: false
           })
        }
        
    }
    // 放大
    add() {
        let echartInstance = this.ChartRef.current.getEchartsInstance();
        let zoom = echartInstance.getOption().series[0].zoom;
        const addNum = 0.2;
        zoom += addNum
        echartInstance.setOption({
            series: {
                zoom
            }
        })

    }
    // 缩小
    decrese() {
        let echartInstance = this.ChartRef.current.getEchartsInstance();
        let zoom = echartInstance.getOption().series[0].zoom;
        const addNum = 0.2;
        zoom -= addNum
        echartInstance.setOption({
            series: {
                zoom
            }
        })
    }
    // 搜索分页加载
    fetchData() {
        let { page,graphType, keyWord, resultList } = this.state;
        page++
        // page++
        EsSearch ({
            graphType,
            keyWord: keyWord,
            page,
            size: 20
        }).then(res => {
            if (res && res.data.retCode == '00000' && res.data.data.list && res.data.data.list.length > 0) {
                let result = res.data.data.list.map(item => {
                    return { name: item.name, type: item.ooName, id: item.id, origin: this.state.searchBoxArr.find(s => s.value == item.graphType).label, graphType: item.graphType}
                })
                resultList = resultList.concat(result)
                this.setState({
                    resultList,
                    hasNext: res.data.data.hasNext,
                    page
                })
            } else {
                this.setState({
                    resultList: [],
                    hasNext: false
                })
            }
        })
    }
    // 点击左侧列表
    selectInstance (target) {
        let { graphData, originData } = this.state;
        let echartInstance = this.ChartRef.current.getEchartsInstance();
        let that = this;
        GraphExtends({
            instanceId: target.id,
            graphType: target.graphType,
            page:1,
            size: 10
        }).then(res => {
            if (res && res.data.retCode == '00000' && res.data.data) {
                let nodes = res.data.data.nodes;
                if (nodes && nodes.length > 0) {
                    nodes = nodes.map(item => {
                        if (item.id !== that.state.originNodeId) {
                            return { ...item, category: that.state.searchBoxArr.find(s => s.value == item.graphType).label, source: that.state.searchBoxArr.find(s => s.value == item.graphType).label, sourceId: item.graphType, labels: that.state.originNodeId }
                        } else {
                            return { ...item, category: that.state.searchBoxArr.find(s => s.value == item.graphType).label, source: that.state.searchBoxArr.find(s => s.value == item.graphType).label, sourceId: item.graphType, labels: 'origin' }
                        }
                    })
                }
                let links = res.data.data.links;

                if (links && links.length > 0) {
                    links = links.map(item => {
                        return { ...item, name: item.ooName, labels: that.state.originNodeId }
                    })
                }
                res.data.data.links = links;
                res.data.data.nodes = nodes;

                let oldNodes = graphData.nodes;
                let oldLinks = graphData.links;

                let newNodes = nodes;
                let newLinks = links;



                oldNodes = oldNodes.concat(newNodes);
                let nodeObj = {}
                oldNodes = oldNodes.reduce((pre, next) => {
                    nodeObj[next.id] ? "" : nodeObj[next.id] = true && pre.push(next)
                    return pre;
                }, [])

                oldLinks = oldLinks.concat(newLinks)
                let linksObj = {};
                oldLinks = oldLinks.reduce((pre, next) => {
                    linksObj[next.id] ? "" : linksObj[next.id] = true && pre.push(next)
                    return pre;
                }, [])
                that.linkMark(oldLinks);
                let relations = oldLinks.map(item => {
                    return {ooName: item.ooName, ooId: item.ooId, id: item.ooId, key: item.ooId}
                })
                // 关系过滤table数据源
                let obj = {};
                relations = relations.reduce((pre,cur) => {
                    obj[cur.id]? '': obj[cur.id] = true && pre.push(cur)
                    return pre
                },[])
                // 类型过滤
                let types = oldNodes.map(item => {
                    return {typeName: item.ooName, ooId: item.ooId, id: item.ooId, key: item.ooId}
                })

                let objType = {};
                types = types.reduce((pre,cur) => {
                    objType[cur.id]? '': objType[cur.id] = true && pre.push(cur)
                    return pre
                },[])

                // 来源过滤
                let origins = oldNodes.map(item => {
                    return { originName: item.source, id: item.sourceId, key: item.sourceId }
                })
                let objOrigin = {};
                origins = origins.concat(originData)
                origins = origins.reduce((pre, cur) => {
                    objOrigin[cur.id]? '': objOrigin[cur.id] = true && pre.push(cur)
                    return pre
                },[])
                that.setStyle({nodes: oldNodes, links: oldLinks})

                that.filterData({nodes: oldNodes, links: oldLinks});
                echartInstance.setOption({
                    series: {
                        data: oldNodes,
                        links: oldLinks
                    }
                })
                that.setState({
                    graphData: Object.assign({}, graphData, { nodes: oldNodes, links: oldLinks }),
                    relationData: relations,
                    typeData: types,
                    originData: origins,
                    clickNodes: [that.state.originNodeId]
                }, () => {
                })
            }
        })

        queryAttr({
            instanceId: target.id,
            graphType: target.graphType,
        }).then(res => {
            if (res.data.retCode == '00000' && res.data.data.properties && res.data.data.properties.length >0) {
               let result = res.data.data.properties.map(item => {
                   return {
                       attrName: item.ooName,
                       attrValue: item.value,
                       id: item.id,
                       key: item.id
                   }
               })
               this.setState({
                   attrData: result
               })
            }
        })
    }
    // togggle relation
    toggleRelation () {
        let { isShowRelation } = this.state;
        this.setState({
            isShowRelation: isShowRelation? false: true,
            isShowPath: false
        })
    }
    // toggle path
    togglePath () {
        let { isShowPath } = this.state;
        this.setState({
            isShowPath: isShowPath? false: true,
            isShowRelation: false
        })
    }
    // changetable 关系过滤
    changeTableRelation (selectedRowKeys, selectedRows) {
       this.setState({
          relationCondition: selectedRows,
          selectedRowKeysRelation: selectedRowKeys,
          selectedRowsRelation: selectedRows
       })
    }
    // 类型过滤
    changeTableType (selectedRowKeys, selectedRows) {
       this.setState({
           typeCondition: selectedRows,
           selectedRowsType: selectedRows,
           selectedRowKeysType: selectedRowKeys
       })
    }
    // 来源过滤
    changeTableOrigin (selectedRowKeys, selectedRows) {
      this.setState({
          originCondition: selectedRows,
          selectedRowsOrigin: selectedRows,
          selectedRowKeysOrigin: selectedRowKeys
      })
    }
    // 路径分析
    changeTablePath (selectedRowKeys, selectedRows) {
        if (selectedRows.length > 2) {
            message.warn('只能选择两个实例进行分析!')
            return false
        }
        this.setState({
            shortCondition: selectedRows,
            selectedRows: selectedRows,
            selectedRowKeys
        })
    }

    // 确定  触发条件
    confirm (type) {
       let { relationCondition, typeCondition, originCondition, graphData } = this.state;
       let filterResult = JSON.parse(JSON.stringify(graphData));
       let echartInstance = this.ChartRef.current.getEchartsInstance();
       let links = filterResult.links;
       let nodes = filterResult.nodes;
       if (relationCondition && relationCondition.length > 0) {
        links = links.filter((link) => {
          if (link.hasOwnProperty("ooId")) {
            if (relationCondition.findIndex(item => item.ooId === link.ooId) > -1) {
              return true
            }
          }
          return false;
        });
        nodes = nodes.filter((d) => {
          let findIndex = links.findIndex(item =>  item.target === d.id || item.source === d.id);
          return findIndex >= 0;
        })
       
       }
       if (typeCondition && typeCondition.length > 0) {
           nodes = nodes.filter((n) => {
               if (n.hasOwnProperty("ooId")) {
                   if (typeCondition.findIndex(item => item.ooId === n.ooId) > -1) {
                       return true
                   }
               }
               return false
           });

           links = links.filter((l) => {
               let findIndex = nodes.findIndex(item => l.target === item.id || l.source === item.id);
               return findIndex  >= 0
           })
       }
       if (originCondition && originCondition.length > 0) {
            nodes = nodes.filter((n) => {
                if (n.hasOwnProperty("sourceId")) {
                    if (originCondition.findIndex(item => item.id === n.sourceId) > -1) {
                        return true
                    }
                }
                return false
            });
            links = links.filter((l) => {
                let findIndex = nodes.findIndex(item => l.target === item.id || l.source === item.id);
                return findIndex  >= 0
            })
       }
       echartInstance.setOption({
            series: [{
                data: nodes,
                links
            }]
       })
    }
    // 确定类型过滤
    confirmType () {

    }
    // 确定来源过滤
    confirmOrigin () {

    }
    // 确定路径分析
    confirmPath () {
        let  { shortCondition, graphData } = this.state;
        let that = this
        if (shortCondition.length !=2) {
            message.warn('至少选择两个分析条件！')
            return
        }
        let originGraphData = JSON.parse(JSON.stringify(graphData));
        let oNodes = originGraphData.nodes, oLinks = originGraphData.links;
        MostShortSearch({
                source: shortCondition[0].id,
                sourceGraphType: shortCondition[0].graphType,
                target: shortCondition[1].id,
                targetGraphType: shortCondition[1].graphType
        }).then(res => {
            if (res.data.retCode == '00000' && res.data.data) {
                let nodes = res.data.data.nodes,links = res.data.data.links;
                if (nodes && nodes.length > 0) {
                    nodes = nodes.map(item => {
                        if (item.id !== that.state.originNodeId) {
                            return { ...item, category: that.state.searchBoxArr.find(s => s.value == item.graphType).label, source: that.state.searchBoxArr.find(s => s.value == item.graphType).label, sourceId: item.graphType, labels: that.state.originNodeId }
                        } else {
                            return { ...item, category: that.state.searchBoxArr.find(s => s.value == item.graphType).label, source: that.state.searchBoxArr.find(s => s.value == item.graphType).label, sourceId: item.graphType, labels: 'origin' }
                        }
                    })
                }

                if (links && links.length > 0) {
                    links = links.map(item => {
                        return { ...item, name: item.ooName, labels: that.state.originNodeId}
                    })
                }
                // res.data.data.links = links;
                // res.data.data.nodes = nodes;
                oNodes.forEach(n => {
                    let index = nodes.findIndex(o => o.id == n.id)
                    if (index != -1) {
                        nodes.splice(index, 1)
                    }
                })

                oLinks.forEach(l => {
                    links.forEach(k => {
                        k.linkColor = 'red'
                        if (l.id === k.id) {
                            l.linkColor = 'red'
                        }
                    })
                    let index = links.findIndex( ks => ks.id == l.id);
                    if (index != -1) {
                        links.splice(index, 1)
                    }
                })
                // oLinks = oLinks.filter((l) => {
                //     let findIndex = oNodes.findIndex(item => l.target === item.id || l.source === item.id);
                //     return findIndex  >= 0
                // })
        
                let  resultNodes = oNodes.concat(nodes);
                let  resultLinks = oLinks.concat(links);
                this.linkMark(resultLinks);
                this.setStyle({nodes: resultNodes, links: resultLinks});
                let echartInstance = this.ChartRef.current.getEchartsInstance();
                echartInstance.setOption({
                    series: [{
                        data: resultNodes,
                        links: resultLinks
                    }]
                })
                this.setState({
                    graphData: Object.assign({}, graphData, {nodes: resultNodes, links: resultLinks}),
                    shortCondition
                })
            }
        })  
    }
    // 属性展示
    onChangeSwitch (val) {
       this.setState({
        isShowTb: val
       })
    }
    // 重置关系过滤
    resetRelation () {
       this.setState({
           relationCondition: [],
           selectedRowKeysRelation: [],
           selectedRowsRelation: []
       }, () => {
          this.confirm()
       })
    }
    // 重置类型过滤
    resetType () {
        this.setState({
            typeCondition: [],
            selectedRowsType: [],
            selectedRowKeysType: []
        }, () => {
            this.confirm()
        })
    }
    // 重置来源过滤
    resetOrigin () {

        this.setState({
            originCondition: [],
            selectedRowsOrigin: [],
            selectedRowKeysOrigin: []
        }, () => {
            this.confirm()
        })
    }
    // 删除分析路径
    delPath (record) {
        let { shortData } = this.state;
        let index = shortData.findIndex(item => item.id == record.id);
        if(index >=0) {
            shortData.splice(index,1)
        }
        this.setState({
            shortData
        })
    }
    // 清除图谱
    clearGraph () {
        let echartInstance = this.ChartRef.current.getEchartsInstance();
        echartInstance.setOption({
            series: {
                data: [],
                links: []
            }
        })
        // echartInstance.clear()
        this.setState({
            graphData: {
                nodes: [],
                links: []
            }
        })
    }
    render() {
        const { hasNext, searchBoxArr, defaultValue, graphData, visible, wrapStyle, resultList,relationData, typeData, originData, isShowPath, isShowRelation,shortData, attrData, isShowTb } = this.state;
        // 关系过滤
        const columnsRelation = [
            {
                title: '关系名称',
                dataIndex: 'ooName',
                key: 'ooName'
            }
        ]
        // 类型过滤
        const columnsType = [
            {
                title: '类型',
                dataIndex: 'typeName',
                key: 'typeName'
            }
        ]
        // 来源过滤
        const columnsOrigin = [
            {
                title: '来源',
                dataIndex: 'originName',
                key: 'originName'
            }
        ]
        // 最短路径
        const columnsMostShort = [
            {
                title: '关注实例',
                dataIndex: 'attentionInstance',
                key: 'attentionInstance',
                width: 100,
                render: (record) => {
                  return <Tooltip title={record} placement="top">
                        <span  style={{display: 'inline-block',width:'100px',overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{record}</span> 
                  </Tooltip> 
                }
            },{
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 100
            },{
                title: '操作',
                dataIndex: 'action',
                key:'action',
                width: 100,
                render: (text,record) => {
                    return <Icon onClick={() =>this.delPath(record)} type="delete"></Icon>
                }
            }
        ]
        // 节点属性展示
        const columnsAttr = [
            {
                title: '属性',
                dataIndex: 'attrName',
                key: 'attrName'
            },{
                title: '属性值',
                dataIndex: 'attrValue',
                key: 'attrValue'
            }
        ]
        return (
            <div className="Test">
                <div className="search_area">
                    <SearchBox
                        onChange={this.changeSelect}
                        onSearch={this.changeSearch}
                        options={searchBoxArr}
                        defaultValue={defaultValue}
                    />
                    <div className="search_result_title">
                        <span>实例</span>
                        <span>类型</span>
                        <span>来源</span>
                        <span>操作</span>
                    </div>
                    {
                        resultList.length> 0 ? 
                        <InfiniteScroll
                            dataLength={resultList.length}
                            next={this.fetchData.bind(this)}
                            hasMore={hasNext}
                            height={660}
                            loader={<h4 style={{ color: '#fff', textAlign: 'center', padding: '5px' }}>Loading...</h4>}
                            endMessage={
                                <p style={{ color: '#fff', textAlign: 'center', padding: '5px' }}>已经加载完毕了</p>
                            }
                        >
                            {
                                resultList.length > 0 ? resultList.map(item => {
                                    return <div className="search_result_item" key={item.id}>
                                        <span>{item.name}</span>
                                        <span>{item.type}</span>
                                        <span>{item.origin}</span>
                                        <span><Icon onClick={() => this.selectInstance(item)} type="plus-circle" /></span>
                                    </div>
                                }) : null
                            }
                        </InfiniteScroll>: null
                    }
                </div>
                {/* 属性展示 */}
                <div className="graph_attr">
                   <Switch defaultChecked onChange={this.onChangeSwitch.bind(this)} />
                   <div className="attr_Table">
                    {
                        isShowTb && attrData.length> 0 ? <Table
                            pagination={false}
                            columns={columnsAttr}
                            dataSource={attrData}
                        /> : null
                    }
                   </div>
                </div>
                <div className="myGraph" style={{ height: '100%' }}>
                    <ReactEchart lazyUpdate={true}  opts={{renderer: 'svg'}}  ref={this.ChartRef} onEvents={this.onclick} style={{ height: '100%' }} option={this.state.option} />
                    {
                        visible ? <div onClick={this.clickMenu.bind(this)} className="contextMenu" style={wrapStyle}>
                            <p>添加关注点</p>
                            <p>移除节点</p>
                        </div> : null
                    }
                </div>
                <div className="fixed_right">
                    <div className="action" style={{backgroundColor: isShowRelation? styles.mainColor: ''}}>
                        <Icon onClick={this.toggleRelation.bind(this)} type="filter" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                    </div>
                    <div className="action" style={{backgroundColor: isShowPath? styles.mainColor: ''}}>
                        <Icon onClick={this.togglePath.bind(this)} type="branches" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}>
                        </Icon>
                        <Badge count={shortData.length}>
                        </Badge>
                    </div>
                    <div className="bottom_action">
                        <div>
                            <Icon onClick={this.add.bind(this)} type="plus-circle" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                        </div>
                        <div>
                            <Icon onClick={this.decrese.bind(this)} type="minus-circle" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                        </div>
                        <div>
                            <Icon onClick={this.clearGraph.bind(this)} type="redo" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                        </div>
                    </div>
                    {/* 关系过滤 */}
                    <div className="relation_filter" style={{display: isShowRelation? 'block': 'none'}}>
                        <Tabs animated={false}>
                            <TabPane tab="关系过滤" key="1">
                                <Table
                                    rowSelection={{
                                        type: 'checkbox',
                                        onChange: this.changeTableRelation.bind(this),
                                        selectedRowKeys: this.state.selectedRowKeysRelation, selectedRows:this.state.selectedRowsRelation
                                    }}
                                    columns={columnsRelation}
                                    dataSource={relationData}
                                    pagination={false}
                                />
                                <div className="table_action">
                                    <span onClick={this.resetRelation.bind(this)}>重置</span>
                                    <span onClick={this.confirm.bind(this)}>确定</span>
                                </div>
                            </TabPane>
                            <TabPane tab="类型过滤" key="2">
                                <Table
                                    rowSelection={{
                                        type: 'checkbox',
                                        onChange: this.changeTableType.bind(this),
                                        selectedRowKeys: this.state.selectedRowKeysType, selectedRows:this.state.selectedRowsType
                                    }}
                                    columns={columnsType}
                                    dataSource={typeData}
                                    pagination={false}
                                />
                                <div className="table_action">
                                    <span onClick={this.resetType.bind(this)}>重置</span>
                                    <span onClick={this.confirm.bind(this)}>确定</span>
                                </div>
                            </TabPane>
                            <TabPane tab="来源过滤" key="3">
                                <Table
                                    rowSelection={{
                                        type: 'checkbox',
                                        onChange: this.changeTableOrigin.bind(this),
                                        selectedRowKeys: this.state.selectedRowKeysOrigin, selectedRows:this.state.selectedRowsOrigin
                                    }}
                                    columns={columnsOrigin}
                                    dataSource={originData}
                                    pagination={false}
                                />
                                <div className="table_action">
                                    <span onClick={this.resetOrigin.bind(this)}>重置</span>
                                    <span onClick={this.confirm.bind(this)}>确定</span>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                    {/* 路径分析 */}
                    <div className="path_analysis" style={{display: isShowPath? 'block': 'none'}}>
                        <Table 
                           rowSelection={{
                               type: 'checkbox',
                               onChange: this.changeTablePath.bind(this),
                               selectedRowKeys: this.state.selectedRowKeys, selectedRows:this.state.selectedRows
                           }}
                           columns={columnsMostShort}
                           dataSource={shortData}
                           pagination={false}
                        />
                        <div className="table_action">
                            <span>取消</span>
                            <span onClick={this.confirmPath.bind(this)}>确定</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}