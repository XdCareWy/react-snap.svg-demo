import React, { Component } from "react";
import { circleGraph, lineGraph, getResponseRectTextBox, responseRectText } from "../basicGraph";
import { NodeOperation } from "../basicGraph/NodeOperation";
import { Modal, message } from "antd";
import LogicUnit from "./LogicUnit";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const LOGIC_TYPE = {
  and: 1,
  or: 2,
  none: 3,
};

class LogicConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [{
        id: 1,
        type: LOGIC_TYPE.none,
        parentId: undefined,
      }],
      visible: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { treeData } = state;
    const copyTreeData = LogicConfig.transformDataToTree(treeData);
    LogicConfig.transformTree(copyTreeData);
    LogicConfig.computeTreeDistance(copyTreeData);
    const flatTree = LogicConfig.flatTree(copyTreeData);
    const canvasW = copyTreeData[0].childNodeCount * 200;
    const canvasH = Math.max.apply(Math, flatTree.map(item => item.floor)) * 120;
    return {
      ...state,
      width: canvasW,
      height: canvasH,
      transformTreeData: copyTreeData,
    };
  }

  componentDidMount() {
    const { transformTreeData } = this.state;
    this.renderLogic(transformTreeData);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { transformTreeData } = this.state;
    this.renderLogic(transformTreeData);
  }

  renderLogic(treeData) {
    const svg = Snap("#svgLogicId");
    svg.clear();
    LogicConfig.loopLine(svg, treeData);
    this.loopRound(svg, treeData);
  }

  static transformDataToTree = data => {
    const _fn = function(parentId) {
      const list = [];
      for (let node of data) {
        if (node.parentId === parentId) {
          const o = {
            id: node.id,
            type: node.type,
            label: node.label,
            parentId: node.parentId,
            tips: node.tips,
            unitValue: node.unitValue,
          };
          o.children = _fn(node.id);
          list.push(o);
        }
      }
      return list;
    };
    return _fn(void 0);
  };

  handleDelete = (svg, centerG, label, node) => {
    Modal.confirm({
      title: "确定删除？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        const { treeData } = this.state;
        if (treeData.length === 1) {
          message.destroy();
          message.warn("一个节点无法删除！");
          return;
        }
        if (node.parentId === void 0) {
          // 如果是根节点，清空数组
          this.setState({
            treeData: [{
              id: 1,
              type: LOGIC_TYPE.none,
              parentId: undefined,
            }],
          });
        } else {
          // 1. 获取当前节点的父节点
          const parentNode = treeData.find(item => item.id === node.parentId);
          // 2. 过滤节点id或节点parentId为当前删除节点id的节点，即删除当前节点及其子孙节点
          let changeData = treeData.filter(item => !(item.id === node.id || item.parentId === node.id));
          // 3. 获取删除节点的兄弟节点
          const childNode = changeData.filter(item => item.parentId === parentNode.id);
          // 4. 如果其兄弟节点个数小于等于1，其兄弟节点应重新指向其爷爷节点
          if (childNode.length <= 1) {
            // 4.1 获取兄弟节点
            const onlyChild = childNode[0];
            // 4.2 找到爷爷节点
            const grandpa = changeData.find(item => item.id === parentNode.parentId) || {};
            // 4.3 将爷爷节点的id给其兄弟节点
            changeData = changeData.map(item => {
              if (item.id === onlyChild.id) {
                return {
                  ...item,
                  parentId: grandpa.id,
                };
              }
              return item;
            });
            // 4.4 过滤掉父节点
            changeData = changeData.filter(item => item.id !== parentNode.id);
          }
          this.setState({ treeData: changeData });
        }
      },
    });
  };

  handleAdd = (svg, centerG, label, node) => {
    let { treeData } = this.state;
    const parentNode = treeData.find(item => item.id === node.parentId) || {};
    const labelType = {
      "||": LOGIC_TYPE.or,
      "&&": LOGIC_TYPE.and,
    };
    // 如果添加的操作，与当前节点或者当前节点的父节点一样，直接push一个新的节点，并改变其parentId
    if (labelType[label] === node.type || labelType[label] === parentNode.type) {
      let parentId = labelType[label] === parentNode.type ? parentNode.id : node.id;
      treeData.push({
        id: treeData.length + 1,
        type: LOGIC_TYPE.none,
        label: treeData.length + 1,
        parentId: parentId,
      });
    } else {
      const orId = treeData.length + 1;
      treeData.push({
        id: orId,
        type: labelType[label],
        label: label,
        parentId: parentNode.id,
      });
      treeData.push({
        id: treeData.length + 1,
        type: LOGIC_TYPE.none,
        label: treeData.length + 1,
        parentId: orId,
      });
      treeData = treeData.map(item => {
        if (item.id === node.id) {
          return {
            ...item,
            parentId: orId,
          };
        }
        return item;
      });
    }
    this.setState({ treeData: treeData });
  };

  operationByType = (type, isDisabled) => {
    const disabledAttr = {
      circleStroke: "#d9d9d9",
      circleFill: "#f5f5f5",
      textFill: "rgba(0,0,0,0.25)",
    };
    const configLogicNode = {
      label: "S",
      clickFn: (svg, e, label, node) => {
        console.log(label);
        this.setState({ visible: true, currentData: node });
      },
      titleTips: "配置表达式",
      attr: {
        circleStroke: "#38649E",
        circleFill: "#E6F1FD",
        textFill: "#336CA8",
      },
      className: "cursor-pointer",
    };
    const plusLogicOr = {
      label: "||",
      clickFn: this.handleAdd,
      titleTips: "新增或节点",
      attr: !isDisabled
        ? disabledAttr
        : {
          circleStroke: "#38649E",
          circleFill: "#E6F1FD",
          textFill: "#336CA8",
        },
      className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    };
    const plusLogicAnd = {
      label: "&&",
      clickFn: this.handleAdd,
      titleTips: "新增与节点",
      attr: !isDisabled
        ? disabledAttr
        : {
          circleStroke: "#38649E",
          circleFill: "#E6F1FD",
          textFill: "#336CA8",
        },
      className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    };
    const deleteNode = {
      label: "-",
      clickFn: this.handleDelete,
      titleTips: "删除节点",
      attr: {
        circleStroke: "#920000",
        circleFill: "#FCDBE0",
        textFill: "#C71723",
      },
    };
    const cancel = {
      label: "C",
      clickFn: function(svg, e, label) {
        console.log(label);
        const r = svg.select("#operationId");
        r.remove();
      },
      titleTips: "取消",
      attr: {
        circleStroke: "red",
        circleFill: "#FCDBE0",
        textFill: "#C71723",
      },
    };
    const typeMap = {
      [LOGIC_TYPE.and]: [cancel, plusLogicOr, plusLogicAnd, deleteNode],
      [LOGIC_TYPE.or]: [plusLogicOr, cancel, deleteNode, plusLogicAnd],
      [LOGIC_TYPE.none]: [deleteNode, configLogicNode, cancel, plusLogicOr, plusLogicAnd],
    };
    return typeMap[type];
  };

  loopRound(svg, data) {
    // 画节点
    for (let i = 0; i < data.length; i++) {
      const mid = data[i];
      if (mid.type === LOGIC_TYPE.none) {
        const { width } = getResponseRectTextBox(svg, 0, 0, mid.tips, 100);
        responseRectText(svg, mid.x - width + 15, mid.y + 35, mid.tips, 100, 0);
      }
      const circleElement = circleGraph(svg, mid.x, mid.y, 10, mid.type === LOGIC_TYPE.none ? "" : mid.label);
      circleElement.click(() => {
        // this.handleAdd(mid);
        let isDisabled = !!mid.tips;
        if (mid.type !== LOGIC_TYPE.none) {
          isDisabled = true;
        }
        NodeOperation(svg, mid.x, mid.y, 35, this.operationByType(mid.type, isDisabled), "", mid, 10);
      });
      if (mid.children.length) {
        this.loopRound(svg, mid.children);
      }
    }
  }

  static loopLine(svg, data) {
    // 画直线
    for (let node of data) {
      if (node.children.length) {
        for (let subNode of node.children) {
          lineGraph(svg, node.x, node.y, subNode.x, subNode.y);
        }
        LogicConfig.loopLine(svg, node.children);
      }
    }
  }

  /**
   * 统计树中各个节点下子节点的数目
   * @param treeData
   * @param floor
   */
  static transformTree(treeData, floor = 1) {
    let rootCount = 0; // 记录每个子树下的节点数目
    // 1. 循环该树
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      node.floor = floor;
      // 2. 该节点是否为 叶子 节点，如果是，当前节点的childNodeCount设置为1；否则，统计当前节点下所有叶子节点的 childNodeCount
      if (node.children.length === 0) {
        node.childNodeCount = 1;
        node.floorNumber = rootCount;
        rootCount++;
      } else {
        const leafCount = LogicConfig.transformTree(node.children, floor + 1);
        node.childNodeCount = leafCount;
        node.floorNumber = rootCount;
        rootCount += leafCount;
      }
    }
    return rootCount;
  }

  /**
   * 计算树的位置，及每个几点之间的距离
   * @param data
   * @param XGap 节点之间横坐标的间距
   * @param yGap 节点之间纵坐标的间距
   * @param offsetY 整棵树在y坐标的偏移量
   * @param offsetX 整棵树在x坐标的偏移量
   */
  static computeTreeDistance(data, XGap = 140, yGap = 70, offsetY = -10, offsetX = 90) {
    for (let node of data) {
      node.y = node.floor * yGap + offsetY;
      node.x = node.childNodeCount * XGap * 0.5 + node.floorNumber * XGap + offsetX;
      if (node.children.length) {
        LogicConfig.computeTreeDistance(node.children, XGap, yGap, offsetY, node.floorNumber * XGap + offsetX);
      }
    }
  }

  /**
   * 平铺整棵树
   * @param treeData
   * @param flatRes
   * @returns {Array}
   */
  static flatTree(treeData, flatRes = []) {
    for (let node of treeData) {
      const { children: subNode, ...other } = node;
      flatRes.push(other);
      if (subNode.length) {
        LogicConfig.flatTree(subNode, flatRes);
      }
    }
    return flatRes;
  }

  getResult = (data, parentType) => {
    const dd = {
      [LOGIC_TYPE.or]: "||",
      [LOGIC_TYPE.and]: "&&",
    };
    const arr = [];
    for (let i = 0; i < data.children.length; i++) {
      const child = data.children[i];
      if (child.type === LOGIC_TYPE.none) {
        arr.push(child.tips);
      }
      if (child.type === LOGIC_TYPE.or || child.type === LOGIC_TYPE.and) {
        arr.push(this.getResult(child, data.type));
      }
    }
    if (data.type === parentType) {
      return arr.join(` ${dd[data.type]} `);
    } else {
      return `(${arr.join(` ${dd[data.type]} `)})`;
    }
  };

  render() {
    const { width, height, visible, currentData, transformTreeData } = this.state;
    return (
      <React.Fragment>
        <svg id="svgLogicId" width={width < 350 ? 350 : width} height={height < 260 ? 260 : height}/>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 20,
          }}>
          {`完整的表达式：${this.getResult(transformTreeData[0], transformTreeData[0].type)}`}
        </div>
        {visible && (
          <LogicUnit
            value={currentData}
            visible={visible}
            onCancel={() => this.setState({ visible: false })}
            onOk={v => {
              const { treeData } = this.state;
              console.log(treeData);
              console.log(v);
              const changeData = treeData.map(item => {
                if (item.id === v.id) {
                  return {
                    ...item,
                    tips: v.tips,
                    unitValue: v.unitValue,
                  };
                }
                return item;
              });
              this.setState({ treeData: changeData, visible: false });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default LogicConfig;
