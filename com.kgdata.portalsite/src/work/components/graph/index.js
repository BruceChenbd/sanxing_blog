import React, {Component} from 'react';
import * as d3 from 'd3';
import {addLabel2, compareData, getMinAndMaxWeight, getNodeDetail, getNodeWeight, textSize} from "../../common/index"
import {genLinkPath, getLineTextDx} from '../../common/getlink';
import {Col, Row} from "antd";
import lodash from "lodash"
import Tool from "../tool/index";
// import Menu from "./Menu";
import moment from "moment/moment";


const ON = "on";
let path;//路径（关系）
let linkText;//关系描述
let node;//节点
let text;//节点描述
let simulation;//d3对象
let currLinkMap;//高亮节点和关系
let minWeight = 0;
let maxWeight = 1;
const defaultPageSize = 50;
const MaxPageSize = 10000;
let zoom = d3.zoom()
let color = d3.scaleOrdinal(d3.schemePaired);
const popUpType = "create_instance_and_relation";

class RelationGraph extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentHeight: document.body.offsetHeight,
      currentWidth: document.body.offsetWidth,
      //可视化数据
      graphData: props.graphData,
      //实例详情
      nodeDetail: null,
      //选中实例id
      selectedNodeId: props.instanceId ? props.instanceId.split(",")[0] : null,
      //原始实例id
      originNodeId: props.instanceId,
      //本体对象id
      instanceObjectId: "",
      //相似原点
      sameOriginNodeId: props.sameInstanceId,
      //缩放开关
      shrinkSwitch: props.shrinkSwitch,
      //热点图开关可见性
      hotSwitchVisible: props.hotSwitchVisible,
      //自定义样式
      customStyle: props.customStyle,
      //添加关注节点函数
      followDataChangeFunc: props.followDataChangeFunc,
      // 最短路径分析结果
      shortestData: {nodes: [], links: []},
      //热点图开关
      hotSwitch: props.hotSwitch,
      //清空函数
      clearFunc: props.clearFunc
    })
  }


  componentWillReceiveProps(nextProps) {
    if (!lodash.isEqual(nextProps, this.props)) {
      this.clearPropertyDiv()
      if (!lodash.isEqual(this.state.graphData, nextProps.graphData) || !lodash.isEqual(this.props.shortestData, nextProps.shortestData)
        || !lodash.isEqual(this.props.instanceId, nextProps.instanceId) || !lodash.isEqual(this.props.hotSwitch, nextProps.hotSwitch)
        || !lodash.isEqual(this.props.sameOriginNodeId, nextProps.sameOriginNodeId)) {
        if(!lodash.isEqual(this.props.instanceId, nextProps.instanceId)){
          let selectedNodeId = nextProps.instanceId ? nextProps.instanceId.split(",")[0] : null;
          let findNode = nextProps.graphData.jsonData.nodes.find(item=>item.id===selectedNodeId);
          if(findNode) {
            this.setState({
              selectedNodeId: selectedNodeId,
              instanceObjectId: findNode.ooId,
            })
          }
        }
        this.setState({
          graphData: nextProps.graphData,
          originNodeId: nextProps.instanceId,
          sameOriginNodeId: nextProps.sameInstanceId,
          shortestData: nextProps.shortestData,
          hotSwitch: nextProps.hotSwitch,
        }, () => {
          this.draw();
        })
      }
    }
  }


  onWindowResize() {

    this.setState({
      currentHeight: document.body.offsetHeight,
      currentWidth: document.body.offsetWidth,
    })
  }

  componentDidMount() {
    let selectedNodeId = this.props.instanceId ? this.props.instanceId.split(",")[0] : null;
    let findNode = this.props.graphData.jsonData.nodes.find(item=>item.id===selectedNodeId);
    if(findNode){
      this.setState({ instanceObjectId:findNode.ooId,})
    }
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.initialize();
    this.draw();
    this.graphScaleTo(1.5)
  }

//添加关注点
  addFollowData() {
    let findNode = this.state.graphData.jsonData.nodes.find(item => item.id === this.state.selectedNodeId);
    if (findNode) {
      if (this.state.followDataChangeFunc) {
        this.state.followDataChangeFunc(findNode, this.state.selectedNodeId);
      }
    }
  }

  //d3初始化
  initialize() {
    let that = this
    let parentHeight;
    let parentWidth;
    parentHeight = document.body.scrollHeight - 160;
    parentWidth = document.body.scrollWidth - 98;
    const {customStyle} = this.state
    if (customStyle) {
      if (customStyle.svgWidth) {
        parentWidth = customStyle.svgWidth;
      }
      if (customStyle.svgHeight) {
        parentHeight = customStyle.svgHeight;
      }
    }
    let svg = d3.select('#relationGraphSvg')
      .attr('width', parentWidth)
      .attr('height', parentHeight);

    svg.selectAll('.g-main').remove();

    let gMain = svg.append('g').classed('g-main', true);

    let rect = gMain.append('rect')
      .attr('width', parentWidth)
      .attr('height', parentHeight)
      .style('fill', 'rgba(0,0,0,0)');

    let gDraw = gMain.append('g');

    zoom = zoom.scaleExtent([0.5, 10]).on('zoom', zoomed);
    gMain.call(zoom).on("dblclick.zoom", null);

    // d3.zoom().scaleTo(gMain,2)
    function zoomed() {
      gDraw.attr('transform', d3.event.transform);
    }

    let marker = gDraw.append("marker")
      .attr("id", "resolved")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 45)
      .attr("refY", 0)
      .attr("markerWidth", 15)
      .attr("markerHeight", 15)
      .attr("orient", "auto")
      .attr("stroke-width", 0.5)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr('fill', '#999');

    path = gDraw.append("g")
      .attr("class", "link")
      .selectAll("path");

    linkText = gDraw.append("g")
      .selectAll(".linkText");

    node = gDraw.append("g")
      .attr("class", "node")
      .selectAll("circle");

    text = gDraw.append("g")
      .selectAll("text");
    let centerX = parentWidth / 2 - 200
    let centerY = parentHeight / 2
    if (that.state.customStyle) {
      if (that.state.customStyle.centerX) {
        centerX = that.state.customStyle.centerX
      }
      if (that.state.customStyle.centerY) {
        centerY = that.state.customStyle.centerY
      }
    }
    simulation = d3.forceSimulation()
      .alphaTarget(0.5)
      .alphaDecay(0.005)
      .alphaMin(0.21)
      .velocityDecay(0.3)
      .force("link",
        d3.forceLink().id(function (d) {
          return d.id;
        }).distance(function (d) {
          let result=textSize("5px","Microsoft YaHei",d.ooName);
          return result.width>100?result.width:100;
        }))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collide", d3.forceCollide().radius(7))
      // .force("radial",  d3.forceRadial().strength(0.2).radius(100).x(parentWidth / 2 - 200).y(parentHeight / 2))
      .force("x", d3.forceX(parentWidth / 2))
      .force("y", d3.forceY(parentHeight / 2))
      .on("tick", ticked);


    rect.on('click', () => {
      /* node.each(function (d) {
         d.selected = false;
         d.previouslySelected = false;
       });*/
      // node.classed("selected", false);
      /* that.setState({
         selectedNodeId: ""
       })*/
      this.clearPropertyDiv()
    });

    function ticked() {
      path.attr("d", function (d) {
        return genLinkPath(d);
      });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      text.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      linkText.attr("dx", function (d) {
        // let result=textSize("5px","Microsoft YaHei",d.ooName);
        return getLineTextDx(d);
      });

      linkText.attr("transform", function (d) {
        ``        // this.getBBox()
        return getLineTextAngle(d, this.getBBox());
      });
    }

    function getLineTextAngle(d, bbox) {
      if (d.target.x < d.source.x) {
        let {
          x,
          y,
          width,
          height
        } = bbox;
        let rx = x + width / 2;
        let ry = y + height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      } else {
        return 'rotate(0)';
      }
    }
  }

  //清除属性展示div
  clearPropertyDiv() {
    let elementById = document.getElementById("relationGraphSvgDiv");
    if (elementById) {
      elementById.parentNode.removeChild(elementById);
    }
  }

//展示属性信息
  showRelationInfo(link, index, direction) {
    let event = this.getEvent();
    this.createPropertyDiv(link.comments, event)
  }

//分页
  handleChange(size, type) {
    let graphData = JSON.parse(JSON.stringify(this.state.graphData));
    const {originNodeId, sameOriginNodeId, selectedNodeId} = this.state
    if (this.props.handleGraphDataChangeFunc) {
      this.props.handleGraphDataChangeFunc(graphData.ontologyId, originNodeId, selectedNodeId, sameOriginNodeId, size, type)
    }
  }

//绘制力导图
  draw() {
    // if (!d3.event.active) {
    simulation.alpha(0.3).restart();
    if (this.state.hotSwitch) {
      let minAndMaxWeight = getMinAndMaxWeight(this.state.graphData.jsonData.nodes);
      minWeight = minAndMaxWeight.minWeight;
      maxWeight = minAndMaxWeight.maxWeight;
    }
    let jsonData = JSON.parse(JSON.stringify(this.state.graphData.jsonData));
    let labelList = JSON.parse(JSON.stringify(this.state.graphData.labelList));
    let that = this
    node.classed("selected", false);
    let nodes = {};
    for (let i = 0; i < jsonData.nodes.length; i++) {
      nodes[jsonData.nodes[i].id] = jsonData.nodes[i];
      jsonData.nodes[i].weight = 1.01;
    }

    let jsonNodes = jsonData.nodes;
    let jsonLinks = jsonData.links;
    //过滤缩放节点的关系和子节点
    jsonLinks=jsonLinks.filter(item=>item.source!==item.target);
    if (labelList.length > 0) {
      for (let i in labelList) {
        jsonNodes = jsonNodes.filter(function (d) {
          return d.label.indexOf(labelList[i]) == -1;
        });
        jsonLinks = jsonLinks.filter(function (d) {
          return d.label.indexOf(labelList[i]) == -1;
        });
      }
    }

    jsonLinks = jsonLinks.filter(function (d) {
      let findIndex = jsonNodes.findIndex(item => item.id === d.target.id || item.id === d.target);
      let findIndex2 = jsonNodes.findIndex(item => item.id === d.source.id || item.id === d.source);
      return findIndex >= 0 && findIndex2 >= 0;
    });


    currLinkMap = genLinkMap(jsonLinks);

    function genLinkMap(links) {
      let hash = {};
      links.map(function ({source, target, ooName}) {
        let key;
        if (typeof source == "string" || typeof target == "string") {
          key = source + '-' + target;
        } else {
          key = source.id + '-' + target.id;
        }
        if (hash[key]) {
          hash[key] += 1;
          hash[key + '-name'] += '、' + ooName;
        } else {
          hash[key] = 1;
          hash[key + '-name'] = ooName;
        }
      });
      return hash;
    }

    let links = jsonLinks;
    // 关系分组
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
      let maxLinkNumber = group.length % 2 == 0 ? group.length / 2
        : (group.length - 1) / 2;
      let startLinkNum = -maxLinkNumber;
      for (let i = 0; i < group.length; i++) {
        group[i].linknum = startLinkNum++;
      }
    }

    simulation.nodes(jsonNodes);
    simulation.force("link").links(jsonLinks);
    path = path.data(jsonLinks, function (d) {
      return d.id;
    });
    path.exit().remove();
    path = path.enter().append("path")
      .attr("id", function (d) {
        return "pathId" + d.id;
      })
      .attr("marker-end", "url(#resolved)")
      .attr("d", function (d) {
        return genLinkPath(d);
      })
      .merge(path);
    path.classed("highLight", false)

    if (that.state.shortestData && that.state.shortestData.links.length > 0) {
      path.filter(function (d) {
        return that.state.shortestData.links.findIndex(item => item.id === d.id) > -1
      }).classed("highLight", true)
    }
    linkText = linkText.data(jsonLinks, function (d) {
      return d.id;
    });
    linkText.exit().remove();
    linkText = linkText.enter().append("text")
      .attr("class", "linkText")
      .attr("id", function (d) {
        return "pathId" + d.id;
      })
      .attr("dx", function (d) {
        return getLineTextDx(d);
      })
      .attr("dy", 0)
      .on("click", this.showRelationInfo.bind(this))
      .merge(linkText);
    linkText.selectAll("textPath").remove();
    linkText.append("textPath")
      .attr("xlink:href", function (d) {
        return "#pathId" + d.id;
      })
      .text(function (d) {
        return d.ooName;
      });

    node = node.data(jsonNodes, function (d) {
      return d.id;
    });
    node.attr("r", function (d) {
      let ratio = 1;
      if (that.state.hotSwitch) {
        let weight = getNodeWeight(d);
        ratio += (weight - minWeight) / (maxWeight - minWeight);
      }
      return ratio * 7
    })

    node.exit().remove();
    node.classed("origin", false)
    node.classed("same", false)
    node.classed("selected", false)

    node = node.enter().append("circle")/*append("image")
      .attr("xlink:href", function(d) { return "http://localhost:9999/1.jpg"; })
      .attr("x", "-12px")
      .attr("y", "-12px")
      .attr("width", "24px")
      .attr("height", "24px")*/
      .attr("r", function (d) {
        let ratio = 1;
        if (that.state.hotSwitch) {
          let weight = getNodeWeight(d);
          ratio += (weight - minWeight) / (maxWeight - minWeight);
        }
        return ratio * 7
      })
      .attr("fill", function (d) {
        return d.color;
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("dblclick", this.dblclick.bind(this))
      .on("click", this.click.bind(this))
      .on("mouseenter", function (currNode) {
        d3.select(this).transition()
          .attr("r", function (d) {
            let ratio = 1;
            if (that.state.hotSwitch) {
              let weight = getNodeWeight(d);
              ratio += (weight - minWeight) / (maxWeight - minWeight);
            }
            return ratio * 14
          })
        toggleNode(node, currNode, true);
        toggleText(text, currNode, true);
        togglePath(path, currNode, true);
        toggleLinkText(linkText, currNode, true);
      })
      .on("mouseleave", function (currNode) {
        d3.select(this).transition()
          .attr("r", function (d) {
            let ratio = 1;
            if (that.state.hotSwitch) {
              let weight = getNodeWeight(d);
              ratio += (weight - minWeight) / (maxWeight - minWeight);
            }
            return ratio * 7
          })
        toggleNode(node, currNode, false);
        toggleText(text, currNode, false);
        togglePath(path, currNode, false);
        toggleLinkText(linkText, currNode, false);
      })
      .merge(node);

    node.filter(function (d) {
      return d.id === that.state.selectedNodeId;
    }).classed("selected", true);

    node.filter(function (d) {
      return that.state.originNodeId.indexOf(d.id) > -1;
    }).classed("origin", true);
    node.filter(function (d) {
      return d.id === that.state.sameOriginNodeId;
    }).classed("same", true);
    text = text.data(jsonNodes, function (d) {
      return d.id;
    });

    text.exit().remove();
    text = text.enter().append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.name
      })
      .merge(text);

    node.selectAll("title").remove();
    node.append("title").html(function (d) {

      return `<div>${d.name}</div>`;
    });

    function dragstarted(d) {
      // if (!d3.event.active) {
      // simulation.alpha(0.3).restart();
      // }

      if (!d.selected) {
        node.classed("selected", function (p) {
          return p.selected = p.previouslySelected = false;
        });
      }

      d3.select(this).classed("selected", function (p) {
        d.previouslySelected = d.selected;
        that.setState({
          selectedNodeId: d.id
        })
        return d.selected = true;
      });

      node.filter(function (d) {
        return d.selected;
      }).each(function (d) {
        d.fx = d.x;
        d.fy = d.y;
      })

    }

    function dragged(d) {
      simulation.alpha(0.3).restart();
      node.filter(function (d) {
        return d.selected;
      }).each(function (d) {
        d.fx += d3.event.dx;
        d.fy += d3.event.dy;
      })
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }

      d.fx = null;
      d.fy = null;
      node.filter(function (d) {
        return d.selected;
      }).each(function (d) {
        d.fx = null;
        d.fy = null;
      })
    }

    function toggleNode(node, currNode, isHover) {
      if (isHover) { // 提升节点层级
        node.style('opacity', .1).filter(
          node => isLinkNode(currNode, node)).style('opacity', 1);
      } else {
        node.style('opacity', 1);
      }
    }

    function toggleText(text, currNode, isHover) {
      if (isHover) { // 提升节点层级
        text.style('opacity', .1).filter(
          node => isLinkNode(currNode, node)).style('opacity', 1);
      } else {
        text.style('opacity', 1);
      }
    }

    function isLinkNode(currNode, node) {
      if (currNode.id === node.id) {
        return true;
      }
      return currLinkMap[currNode.id + '-' + node.id] || currLinkMap[node.id
      + '-' + currNode.id];
    }

    function togglePath(link, currNode, isHover) {
      if (isHover) { // 加重连线样式
        link.style('opacity', .1).filter(
          link => isLinkLine(currNode, link)).style('opacity', 1).classed(
          'link-active', true);
      } else { // 连线恢复样式
        link.style('opacity', 1).classed('link-active', false);
      }
    }

    function toggleLinkText(linkText, currNode, isHover) {
      if (isHover) { // 只显示相连连线文字
        linkText.style('fill-opacity',
          link => isLinkLine(currNode, link) ? 1.0 : 0.0);
      } else { // 显示所有连线文字
        linkText.style('fill-opacity', '1.0');
      }
    }

    function isLinkLine(node, link) {
      return link.source.id == node.id || link.target.id == node.id;
    }

    simulation.alphaTarget(0.2).restart();
    this.graphScaleTo(-0.2)
  }

//单击事件
  click(d) {
    this.setState({
      selectedNodeId: d.id,
      instanceObjectId: d.ooId,
    })
  };

//双击事件
  dblclick(d) {
    let that = this
    let graphData = JSON.parse(JSON.stringify(this.state.graphData));
    if (!d3.event.defaultPrevented) {
      that.setState({
        selectedNodeId: d.id,
        instanceObjectId: d.ooId,
      });
      let flag = false;
      let labelList = graphData.labelList;
      let idList = graphData.idList;
      for (let i in idList) {
        if (d.id === idList[i]) {
          flag = true;
          if (this.state.shrinkSwitch) {
            if (labelList.length > 0) {
              let boolean = false;
              for (let j = 0; j < labelList.length; j++) {
                if (d.id === labelList[j]) {
                  boolean = true;
                  labelList.splice(j, 1);
                  j--;
                  break;
                }
              }
              if (!boolean && labelList.indexOf(d.id) === -1) {
                labelList.push(d.id);
              }
            } else {
              labelList.push(d.id);
            }
            graphData.labelList = labelList;
            if (this.props.updateGraphDataFunc) {
              this.props.updateGraphDataFunc(graphData)
            }
          } else {
            return
          }
        }
      }
      if (!flag) {
        if (this.props.getGraphDataFunc) {
          this.props.getGraphDataFunc(this.state.originNodeId, d.id, this.state.sameOriginNodeId, ON, ON, graphData.ontologyId, 0, defaultPageSize, d, "1")
        }
      }
    }
  }

  getEvent() {
    return window.event || arguments.callee.caller.arguments[0];
  }

//创建一个属性展示div
  createPropertyDiv(data, e) {
    if (data == null) {
      return
    }
    let x = e.clientX;
    let y = e.clientY;
    let relationGraph = document.getElementById("relationGraph");
    this.clearPropertyDiv();
    let divElement = document.createElement("div");
    divElement.style.cssText = 'position:absolute;background:white;z-index:2005;left:' + (x - 1024) + "px;top:" + (y - 300) + "px;width:400px;height:260px;" +
      "overflow-y:auto;border:e0e0e1 solid 1px;border-radius:4px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);text-align:center;vertical-align: middle"
    divElement.id = "relationGraphSvgDiv";
    let tableElement = document.createElement("table");
    if (data) {
      if (data.length === 0) {
        let trElement = document.createElement("tr");
        trElement.style.width = "400px";
        let tdElement = document.createElement("td");
        tdElement.innerHTML = "暂无数据";
        tdElement.style.cssText = "width:400px;padding:10px 10px;border-bottom: #e0e0e1 solid 1px;text-align: center;";
        trElement.appendChild(tdElement);
        tableElement.appendChild(trElement)
      }
      if (data.length > 0) {
        data.map(item => {
          if (item.value) {
            let trElement = document.createElement("tr");
            trElement.style.width = "400px";
            let tdElement = document.createElement("td");
            tdElement.innerHTML = item.ooName;
            tdElement.style.cssText = "width:150px;padding:10px 10px;border-bottom: #e0e0e1 solid 1px;";
            let tdElement2 = document.createElement("td");
            if(item.dataType.toUpperCase()==="DATE"){
              tdElement2.innerHTML = moment(Number(item.value)).format("YYYY-MM-DD HH:mm:ss");
            }else{
              tdElement2.innerHTML = item.value;
            }
            tdElement2.style.cssText = "width:250px;padding:10px 10px;border-bottom: #e0e0e1 solid 1px;";
            trElement.appendChild(tdElement);
            trElement.appendChild(tdElement2);
            tableElement.appendChild(trElement)
          }
        })
      }
    }

    divElement.appendChild(tableElement)
    relationGraph.appendChild(divElement);
  }

//实例详情回调
  nodeDetailCallback(nodeDetail, e) {
    this.setState({
      nodeDetail: nodeDetail,
    })
    this.createPropertyDiv(nodeDetail.propertyDTOS, e)
  };

//展示实例详情
  // showInstanceInfo(selectedNodeId, e) {
  //   const {graphData} = this.state
  //   if (!selectedNodeId || selectedNodeId == 'keywordNode') {
  //     return;
  //   }
  //   getNodeDetail(graphData.ontologyId, selectedNodeId, ON, ON, e, this.nodeDetailCallback.bind(this))

  // }


//添加关系回调函数,刷新可视化
  addRelationCallback(data, srcId) {
    let graphData = JSON.parse(JSON.stringify(this.state.graphData));
    let jsonData = graphData.jsonData;
    let number = jsonData.nodes.findIndex(item => item.id === srcId);
    compareData(data, jsonData)
    addLabel2(data, jsonData.nodes[number], graphData.idList);
    if (this.props.updateGraphDataFunc) {
      this.props.updateGraphDataFunc(graphData)
    }
  }


  //放大缩小
  graphScaleTo(ratio) {
    ratio += 1
    let gMain = d3.select('#relationGraphSvg').selectAll('.g-main');
    zoom.scaleBy(gMain, ratio)
  }

//清空图谱
  clear() {
    if (this.state.clearFunc) {
      this.state.clearFunc()
    }
  }

  render() {
    const {
      sameOriginNodeId, graphData, hotSwitch, instanceObjectId, selectedNodeId, customStyle, hotSwitchVisible
    } = this.state;
    let contentHeight = document.body.scrollHeight - 160;
    let contentWidth = document.body.scrollWidth - 98;
    if (customStyle) {
      if (customStyle.contentWidth) {
        contentWidth = customStyle.contentWidth;
      }
      if (customStyle.contentHeight) {
        contentHeight = customStyle.contentHeight;
      }
    }
    return (
      <div style={{minWidth: contentWidth, height: contentHeight}}>
        <Row style={{height: '340px', position: 'relative'}}>
          <Col id="relationGraph" span={22}>
            <svg id={"relationGraphSvg"} style={{borderColor: "rgba(232, 232, 232)", background: 'rgba(0,0,0,0)',borderWidth: 0}}/>
          </Col>

          <Col span={1} push={1} className="action_box" style={{position:'absolute',left:'95%', bottom:'15px', display: 'inline-block',width:'32px'}}>
            <Tool contentHeight={contentHeight} hotSwitchVisible={hotSwitchVisible} hotSwitch={hotSwitch}
                  graphScaleToFunc={this.graphScaleTo.bind(this)} clearFunc={this.state.clearFunc ? this.clear.bind(this) : null}/>
          </Col>
        </Row>
         {/* <Menu key={selectedNodeId} selectedNodeId={selectedNodeId} sameOriginNodeId={sameOriginNodeId} instanceObjectId={instanceObjectId} projectId={graphData.projectId}
              kgId={graphData.kgId} type={this.props.type}
              ontologyId={graphData.ontologyId} addRelationCallbackFunc={this.addRelationCallback.bind(this)} handleChangeFunc={this.handleChange.bind(this)}
              addFollowDataFunc={this.addFollowData.bind(this)} showInstanceInfoFunc={this.showInstanceInfo.bind(this)} hotSwitchVisible={true}
        /> */}

      </div>
    );
  }
}

export default RelationGraph;
