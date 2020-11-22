import React from 'react';
import ReactEchart from 'echarts-for-react';
import { Icon } from 'antd';
import './index.scss';


export default class MyRelationGraph extends React.Component {
    constructor(props) {
        super(props)
        this.GraphRef = React.createRef()
        this.state = {
            graphData: {
                nodes: [],
                links: []
            }, // 数据源
            echartInstance: null, // 图谱实体
            shrink: [], // 收缩节点
            clickNodes: [], // 点击的节点
            option: { // 图谱的配置
                tooltip: {
                    show: true,
                    formatter: "<div style='display:block;word-break: break-all;word-wrap: break-word;white-space:pre-wrap;max-width: 80px'>" + "{b} " + "</div>"
                },
                toolbox: {
                    feature: {
                        saveAsImage: {show: true, backgroundColor: '#000000'}
                    }
                },
                animationDurationUpdate: 2000,
                animationEasingUpdate: 'quinticInOut',
                series: [{
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 35,
                    draggable: true,
                    roam: true,
                    focusNodeAdjacency: true,
                    edgeSymbol: ['', 'arrow'],
                    cursor: 'pointer',
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
            },
            visible: false, // 右键菜单是否可视
            wrapStyle: { // 右键菜单样式
                position: 'absolute',
                width: '100px',
                padding: '5px 0',
                backgroundColor: '#fff',
            },
            addSource: '', // 右键选中的实体
        }
    }

    componentDidMount() {
        let echartInstance = this.GraphRef.current.getEchartsInstance(), that = this;
        // 取消正常浏览器默认右键菜单
        this.GraphRef.current.echartsElement.oncontextmenu = () => {
            return false
        }
        // 点击空白处 删除右键菜单
        this.GraphRef.current.echartsElement.onclick = function () {
            that.setState({
                visible: false
            })
        }
        this.setState({
            echartInstance
        })
        this.setStyle(this.props.graphData)
        echartInstance.setOption({
            series: {
                data: this.props.graphData.nodes,
                links: this.props.graphData.links
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.graphData) !== JSON.stringify(this.props.graphData)) {
            this.setStyle(nextProps.graphData)
            this.state.echartInstance.setOption({
                series: {
                    data: nextProps.graphData.nodes,
                    links: nextProps.graphData.links
                }
            })
        }
    }
    onclick = {
        'click': this.clickEchartsPie.bind(this),
        'dblclick': this.dblclickPie.bind(this),
        'contextmenu': this.rightMouse.bind(this),
    }
    // 图谱点击事件
    clickEchartsPie(e) {
        if (e.dataType !== 'node') {
            return
        }
        this.props.clickCallback(e)
    }
    // 图谱双击事件
    dblclickPie(e) {
        let { echartInstance, clickNodes, shrink } = this.state;
        if (e.dataType !== 'node') {
            return
        }
        if (clickNodes.includes(e.data.id)) {
            if (shrink.includes(e.data.id)) {
                let index = shrink.findIndex(item => item == e.data.id);
                shrink.splice(index, 1)
            } else {
                shrink.push(e.data.id)
            }
            this.setState({
                shrink
            })
            let nodes = this.props.graphData.nodes;
            let links = this.props.graphData.links;

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
            echartInstance.setOption({
                series: {
                    data: nodes,
                    links
                }
            })
        } else {
            clickNodes.push(e.data.id)
            this.setState({
                clickNodes
            })
            this.props.dblCallback({
                entityId: e.data.id,
                entity: e.data
            })
        }
    }
    // 右键
    rightMouse(e) {
        let { wrapStyle } = this.state;
        if (e.dataType !== 'node') {
            return;
        }
        let event = e.event.event;
        const pageX = event.pageX - 20;
        const pageY = event.pageY;

        this.setState({
            wrapStyle: Object.assign({}, wrapStyle, { left: pageX + 'px', top: pageY + 'px' }),
            visible: true,
            addSource: e.data
        })
    }
    // 放大
    add = () => {
        let { echartInstance } = this.state;
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
    decrese = () => {
        let { echartInstance } = this.state;
        let zoom = echartInstance.getOption().series[0].zoom;
        const addNum = 0.2;
        zoom -= addNum
        echartInstance.setOption({
            series: {
                zoom
            }
        })
    }
    // 清空
    clearGraph = () => {
        const { echartInstance } = this.state;
        echartInstance.setOption({
            series: {
                data: [],
                links: []
            }
        })
    }
    // 右键菜单点击
    clickMenu = (e) => {
        const { addSource } = this.state;
        let param = {
            target: e.target.innerHTML,
            entity: addSource
        }
        this.props.clickMenuCallback(param)
    }
    // 设置实体颜色或者连接线颜色
    setStyle(graphData) {
        graphData.nodes.forEach(item => {
            // 字体颜色设置
            // if (item.color) {
            //     item.label = {
            //         color: item.color,
            //         fontWeight: 'bold'
            //     }
            // }
            // 节点颜色设置
            if (item.color) {
                item.itemStyle = {
                    color: item.color
                }
            }
        })
        graphData.links.forEach(link => {
            link.lineStyle = {
                curveness: link.linknum * 0.1,
                color: link.linkColor ? 'red' : '#fff'
            }
            link.label = {
                align: 'center',
                fontSize: 12,
            };
        });
    }
    render() {
        const { option, wrapStyle, visible } = this.state;
        const { menuData } = this.props;
        return (
            <div className="relation_graph" style={{ height: '100%' }}>
                <ReactEchart onEvents={this.onclick} ref={this.GraphRef} style={{ height: '100%', width: '100%' }} option={option} />
                <div className="scare_action" style={{ top: this.props.tool.top, left: this.props.tool.left }}>
                    <div>
                        <Icon onClick={this.add} type="plus-circle" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                    </div>
                    <div>
                        <Icon onClick={this.decrese} type="minus-circle" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                    </div>
                    <div>
                        <Icon onClick={this.clearGraph} type="redo" style={{ width: '64px', height: '64px', fontSize: '24px', color: 'rgba(255,255,255,0.65)', lineHeight: '64px', cursor: 'pointer' }}></Icon>
                    </div>
                </div>
                {
                    visible && menuData && menuData.length> 0 ? <div onClick={this.clickMenu} className="contextMenu" style={wrapStyle}>
                        {
                            menuData && menuData.length > 0 ? menuData.map(item => <p key={item.id}>{item.name}</p>) : null
                        }
                    </div> : null
                }
            </div>
        )
    }
}