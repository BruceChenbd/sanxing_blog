import { queryEntityInstance } from '../server/index';
import { message } from 'antd';
import { queryRelationGraph, queryDocumentGraph } from '../server/index';


const ON = 'on';

// 比较新老数据
export function compareData(data, jsonData) {
  const oldNodeLength = jsonData.nodes.length;
  for (let i = 0; i < oldNodeLength; i++) {
    jsonData.nodes[i].inWeight = 0;
    jsonData.nodes[i].outWeight = 0;
  }
  jsonData.nodes = jsonData.nodes.concat(data.nodes);
  for (let i = 0; i < oldNodeLength; i++) {
    for (let j = oldNodeLength; j < jsonData.nodes.length; j++) {
      if (jsonData.nodes[i].id === jsonData.nodes[j].id) {
        if (jsonData.nodes[j].inWeight) {
          jsonData.nodes[i].inWeight = jsonData.nodes[j].inWeight;
        } else {
          jsonData.nodes[i].inWeight = 0;
        }
        if (jsonData.nodes[j].outWeight) {
          jsonData.nodes[i].outWeight = jsonData.nodes[j].outWeight;
        } else {
          jsonData.nodes[i].outWeight = 0;
        }
        jsonData.nodes.splice(j, 1);
        j--;
        break;
      }
    }
  }
  const oldLinkLength = jsonData.links.length;
  jsonData.links = jsonData.links.concat(data.links);
  for (let i = 0; i < oldLinkLength; i++) {
    for (let j = oldLinkLength; j < jsonData.links.length; j++) {
      if (jsonData.links[i].id === jsonData.links[j].id) {
        if (jsonData.links[j].weight) {
          jsonData.links[i].weight = jsonData.links[j].weight;
        } else {
          jsonData.links[i].weight = 0;
        }
        jsonData.links.splice(j, 1);
        j--;
        break;
      }
    }
  }
}

// 加相似label
export function addSameLabel(originJson, SameJson, idList, label, originNodeId, sameOriginNodeId, selectedNodeId) {
  addLabel(originJson, originNodeId, idList);
  addLabel(SameJson, sameOriginNodeId);
  const oldNodeLength = originJson.nodes.length;
  originJson.nodes = originJson.nodes.concat(SameJson.nodes);
  const oldLinkLength = originJson.links.length;
  originJson.links = originJson.links.concat(SameJson.links);
  let concatLinks = [];
  for (let i = 0; i < oldNodeLength; i++) {
    for (let j = oldNodeLength; j < originJson.nodes.length; j++) {
      if (originJson.nodes[i].id === originJson.nodes[j].id) {
        originJson.nodes.splice(j, 1);
        originJson.nodes[i].label = label;
        const links1 = originJson.links.filter(link =>
          (link.source === originJson.nodes[i].id || link.source.id === originJson.nodes[i].id) && (link.target === originNodeId || link.target.id === originNodeId) ||
          (link.source === originNodeId || link.source.id === originNodeId) && (link.target === originJson.nodes[i].id || link.target.id === originJson.nodes[i].id));
        const links2 = originJson.links.filter(link =>
          (link.source === originJson.nodes[i].id || link.source.id === originJson.nodes[i].id) && (link.target === sameOriginNodeId || link.target.id === sameOriginNodeId) ||
          (link.source === sameOriginNodeId || link.source.id === sameOriginNodeId) && (link.target === originJson.nodes[i].id || link.target.id === originJson.nodes[i].id));
        concatLinks = concatLinks.concat(links1.concat(links2));
        j--;
        break;
      }
    }
  }

  for (let i = 0; i < oldLinkLength; i++) {
    for (let j = oldLinkLength; j < originJson.links.length; j++) {
      if (originJson.links[i].id === originJson.links[j].id) {
        originJson.links.splice(j, 1);
        j--;
        break;
      }
    }
  }
  concatLinks.map((item) => {
    const findIndex = originJson.links.findIndex(e => e.id === item.id);
    originJson.links[findIndex].label = label;
  });
  if (idList.indexOf(selectedNodeId) === -1) {
    idList.push(selectedNodeId);
  }
  if (idList.indexOf(originNodeId) === -1) {
    idList.push(originNodeId);
  }
  return originJson;
}

// 给原点打label
export function addLabel(json, id, idList) {
  for (const i in json.nodes) {
    if (id.indexOf(json.nodes[i].id) > -1) {
      json.nodes[i].label = 'origin';
    } else {
      json.nodes[i].label = id;
    }
  }
  for (const i in json.links) {
    json.links[i].label = id;
  }
  // 多原点分隔
  const ids = id.split(',');
  ids.map((item) => {
    if (idList.indexOf(item) == -1) {
      idList.push(item);
    }
  });
}

// 给除原点外的其他点打label
export function addLabel2(json, d, idList) {
  if (d.label === 'origin') {
    for (const i in json.nodes) {
      json.nodes[i].label = d.id;
    }
    for (const i in json.links) {
      json.links[i].label = d.id;
    }
  } else {
    console.log(json,'json')
    for (const i in json.nodes) {
      json.nodes[i].label = `${d.label},${d.id}`;
    }
    for (const i in json.links) {
      json.links[i].label = `${d.label},${d.id}`;
    }
    if (idList.indexOf(d.id) == -1) {
      idList.push(d.id);
    }
  }
}

/**
 * 关联数据初始化
 * @param originNodeId 需要查询的原点实体id,支持多个实体id,用逗号分隔的字符串查询
 * @param selectedNodeId 需要查询的选中的实体id,支持多个实体id,用逗号分隔的字符串查询
 * @param sameInstanceId 相似实体id
 * @param status 查询的实体状态 delete 删除  on 可用 null全部查出来
 * @param checked 审核状态 on 审核通过 check 处于审核状态 failed 审核驳回 draft 检查状态
 * @param ontologyId 本体id
 * @param pageNumber 页码
 * @param pageSize 每页查询个数
 * @param node d3中的节点
 * @param action 操作类型   0:可视化初始查询,1:节点展开
 * @param returnData 需要返回的对象
 */
export function getJsonData(originNodeId, selectedNodeId, sameInstanceId, status, checked, ontologyId, pageNumber, pageSize, node, action, returnData, callback) {
  if (!selectedNodeId) {
    return;
  }
  // queryDocumentGraph({id:selectedNodeId }).then(res => {
  //   console.log(res,'res')
  // })
  queryDocumentGraph({id: selectedNodeId})
    .then((res) => {
      if (res.data.data) {
        console.log(res.data.data)
        //初始化查询
        console.log(action,'action')
        if (action === "0") {
          if (res.data.data.nodes) {
            if (res.data.data.nodes.length > 0) {
              res.data.data.nodes.map(item => {
                item["pageNumber"] = 0;
              })
            }
          }
          addLabel(res.data.data, originNodeId, returnData.idList);
          compareData(res.data.data, returnData.jsonData);
          if (sameInstanceId && sameInstanceId !== '') {
            queryDocumentGraph({id: sameInstanceId}).then((res) => {
              if (res.data.data) {
                if (res.data.data.nodes && res.data.data.nodes.length > 0) {
                  res.data.data.nodes.map((item) => {
                    item.pageNumber = 0;
                  });
                }
                const sameNodeData = res.data.data;
                addLabel(sameNodeData, sameInstanceId, returnData.idList);
                compareData(sameNodeData, returnData.jsonData);
              }
              if (callback) {
                callback(returnData, originNodeId);
              }
            });
          } else if (callback) {
            callback(returnData, originNodeId);
          }
        } else if (action === '1') { // 节点展开查询
          if (res.data.data.nodes.length > 0) {
            res.data.data.nodes.map((item) => {
              if (item.id !== selectedNodeId) {
                item.pageNumber = 0;
              } else {
                item.pageNumber = node.pageNumber;
              }
            });
          }
          addLabel2(res.data.data, node, returnData.idList);
          compareData(res.data.data, returnData.jsonData);
          if (callback) {
            callback(returnData, originNodeId);
          }
        }
      }
    });
}

/**
 * 关联节点分页查询
 * @param ontologyId 本体id
 * @param originNodeId 原始节点id
 * @param selectedNodeId 选中节点 id
 * @param sameOriginNodeId 相似节点
 * @param pageSize
 * @param type 分页操作 next下一页  prev上一页  first第一页
 */
export function handleChange(ontologyId, originNodeId, selectedNodeId, sameOriginNodeId, pageSize, type, returnData, callback) {
  if (!selectedNodeId) {
    message.warn('请先选择实体！');
    return;
  }
  const number = returnData.jsonData.nodes.findIndex(item => item.id === selectedNodeId);
  if (number === -1) {
    message.warn('请先选择实体！');
    return;
  }
  const selectNode = returnData.jsonData.nodes[number];
  if (!selectNode.hasOwnProperty('pageNumber')) {
    selectNode.pageNumber = 0;
  }
  if (type === 'next') {
    selectNode.pageNumber += 1;
  } else if (type === 'prev') {
    if (selectNode.pageNumber <= 0) {
      return;
    }
    selectNode.pageNumber -= 1;
  } else if (type === 'first') {
    selectNode.pageNumber = 0;
  }

  queryRelationGraph({sameInstanceId: selectedNodeId})
    .then((res) => {
      if (res.data.data) {
        if (res.data.data.nodes.length > 0) {
          res.data.data.nodes.map((item) => {
            if (item.id !== selectedNodeId) {
              item.pageNumber = 0;
            } else {
              item.pageNumber = selectNode.pageNumber;
            }
          });
        }
      }
      const data = res.data.data;

      if (data.nodes.length > 1) {
        if (returnData.idList.length > 1) {
          // 保留展开的节点
          if (returnData.labelList && returnData.labelList.length > 0) {
            returnData.idList = returnData.idList.filter(item =>
              returnData.labelList.findIndex(i => i === item) < 0);
            returnData.labelList = [];
          }

          const RetainIds = returnData.idList.filter(item =>
            item !== selectedNodeId);

          returnData.jsonData.nodes = returnData.jsonData.nodes.filter((d) => {
            const findIndex = RetainIds.findIndex(item => d.label.endsWith(item));
            const findIndex1 = returnData.idList.findIndex(item => item === d.id);
            return findIndex > -1 || findIndex1 > -1;
          });
          returnData.jsonData.links = returnData.jsonData.links.filter((d) => {
            const findIndex = returnData.jsonData.nodes.findIndex(item => item.id === d.target.id || item.id === d.target);
            const findIndex1 = returnData.jsonData.nodes.findIndex(item => item.id === d.source.id || item.id === d.source);
            return findIndex > -1 && findIndex1 > -1;
          });
        }
        if (selectedNodeId === originNodeId) {
          if (returnData.idList.length > 1) {
            compareData(data, returnData.jsonData);
          } else {
            returnData.jsonData = res.data.data;
            returnData.idList = [];
            returnData.labelList = [];
          }
          addLabel(data, selectedNodeId, returnData.idList);
        } else {
          addLabel2(data, selectNode, returnData.idList);
          compareData(data, returnData.jsonData);
        }
      } else if (type === 'next') {
        selectNode.pageNumber -= 1;
      } else if (type === 'prev') {
        selectNode.pageNumber += 1;
      }
      if (callback) {
        callback(returnData);
      }
    });
}

/**
 *  查询实体详情
 * @param status 查询的实体状态 delete 删除  on 可用 null全部查出来
 * @param nodeId 实例id
 * @param ontologyId 本体id
 * @param event 事件
 * @param callback 回调函数
 * @param checked 审核状态 on 审核通过 check 处于审核状态 failed 审核驳回 draft 检查状态
 */
export function getNodeDetail(ontologyId, nodeId, status, checked, event, callback) {
  let param = {
    'status': status,
    'ontology_id': ontologyId,
    'entity_id': nodeId,
    'checked': checked
  }
  queryEntityInstance(param).then((res) => {
    let nodeDetail = null;
    if (res.data.data) {
      const nodeInfo = res.data.data;
      nodeDetail = nodeInfo;
      let propertyData = nodeInfo.properties;
      if (!propertyData) {
        propertyData = [];
      } else {
        var propertyDataT = [];
        propertyDataT = [
          propertyData.find(item => item.ooName == "密级"),
          propertyData.find(item => item.ooName == "名称"),
          propertyData.find(item => item.ooName == "摘要"),
          propertyData.find(item => item.ooName == "文档时间"),
          propertyData.find(item => item.ooName == "公开范围")
        ]
        propertyData = propertyDataT.filter(e=>!!e);
        console.log(propertyData)
      }
      let relationData = nodeInfo.relations;
      if (!relationData) {
        relationData = [];
      } else {
        relationData.sort((a, b) => a.createTime - b.createTime);
      }
      // 查询关系中的实体名称instanceName,和关系本体对象名称ooName
      const instanceIds = [];
      for (const i in relationData) {
        instanceIds.push(relationData[i].target);
      }
      nodeDetail.propertyDTOS = propertyData;
      if (callback) {
        callback(nodeDetail, event);
      }
    } else if (callback) {
      callback(null);
    }
  });
}


/**
 * 求节点数组中最大权重和最小权重
 * @param nodeArray
 */
export function getMinAndMaxWeight(nodeArray) {
  let minWeight = 0;
  let maxWeight = 1;
  for (let i = 0; i < nodeArray.length; i++) {
    if (!nodeArray[i].inWeight || typeof (nodeArray[i].inWeight) !== 'number') {
      nodeArray[i].inWeight = 0;
    }
    if (!nodeArray[i].outWeight || typeof (nodeArray[i].outWeight) !== 'number') {
      nodeArray[i].outWeight = 0;
    }
    const weight = nodeArray[i].inWeight + nodeArray[i].outWeight;
    if (weight > maxWeight) {
      maxWeight = weight;  // 最大值
    }

    if (weight < minWeight) {
      minWeight = weight;  // 最小值
    }
  }
  return { minWeight, maxWeight };
}


// 获取节点的权重
export function getNodeWeight(d) {
  let weight = 0;
  if (d.inWeight) {
    weight += d.inWeight;
  }
  if (d.outWeight) {
    weight += d.outWeight;
  }
  return weight;
}
// 获取文字实际长度
export function textSize(fontSize, fontFamily, text) {
  const span = document.createElement('span');
  const result = {};
  result.width = span.offsetWidth;
  result.height = span.offsetHeight;
  span.style.visibility = 'hidden';
  span.style.fontSize = fontSize;
  span.style.fontFamily = fontFamily;
  span.style.display = 'inline-block';
  document.body.appendChild(span);
  if (typeof span.textContent !== 'undefined') {
    span.textContent = text;
  } else {
    span.innerText = text;
  }
  result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
  result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
  span.remove();
  return result;
}
