import React from 'react';
import ReactEchart from 'echarts-for-react';


export default class AccessLine extends React.Component {
    constructor(props) {
        super(props)
        this.GraphRef = React.createRef()
        this.state = {
            echartInstance: null, // 图谱实体
            option: {
                backgroundColor: '#fff',
                title: {
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        align: 'center',
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '5%',
                    // bottom: '15%',
                    // containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'item'
                },
                legend: {
                    show: true,
                    x: 'center',
                    y: '95%',
                    icon: 'stack',
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: 'rgba(0,0,0,0.8)'
                    },
                    data: ['PV', 'UV', 'IP']
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        color: 'rgba(0,0,0,0.8)'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#dfe5f2'
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#195384'
                        }
                    },
                    data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点']
                }],
                yAxis: [{
                    type: 'value',
                    name: '',
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: 'rgba(0,0,0,0.8)'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#27b4c2'
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#efefef'
                        }
                    }
                },

                ],
                series: [{
                    name: 'PV',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: '#468cfe',
                            lineStyle: {
                                color: "#468cfe",
                                width: 1
                            },
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'top'
                        }
                    },
                    markPoint: {
                        itemStyle: {
                            normal: {
                                color: '#468cfe'
                            }
                        }
                    },
                    data: [10, 20, 0, 15, 30, 11, 50]
                },
                {
                    name: 'UV',
                    type: 'line',

                    symbol: 'circle',
                    symbolSize: 8,
                    label: {
                        normal: {
                            show: false,
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#29ccb1',
                            lineStyle: {
                                color: "#29ccb1",
                                width: 1
                            },
                        }
                    },
                    data: [0, 10, 15, 18, 20, 50, 60]
                },
                {
                    name: 'IP',
                    type: 'line',

                    symbol: 'circle',
                    symbolSize: 8,
                    label: {
                        normal: {
                            show: false,
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#001529',
                            lineStyle: {
                                color: "#001529",
                                width: 1
                            },
                        }
                    },
                    data: [5, 25, 15, 18, 30, 55, 0]
                },

                ]
            }
        }
    }

    componentDidMount() {
        let echartInstance = this.GraphRef.current.getEchartsInstance(), that = this;
       
        this.setState({
            echartInstance
        })
        // echartInstance.setOption({

        // })
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.graphData) !== JSON.stringify(this.props.graphData)) {
            this.setStyle(nextProps.graphData)
            // this.state.echartInstance.setOption({

            // })
        }
    }

    render() {
        const { option } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <ReactEchart ref={this.GraphRef} style={{ height: '100%', width: '100%' }} option={option} />
            </div>
        )
    }
}