import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data_o, STATUS } from "./data1";
import { NodeOperation } from "./basicGraph/NodeOperation";
import {
  responseRectText,
  getResponseRectTextBox,
  paintRectText,
  arrowLine,
  brokenLineGraph,
} from "./basicGraph/index";
import { logicGraph, computeLogicPoint } from "./combinationGraph/index";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const finishMaxWidth = 100; // 结束节点最大宽度
const conditionMaxWidth = 200; // 条件表达式最大宽度
const verticalSpacing = 60; // 节点之间的垂直间距
const horizontalSpacing = 100; // 节点之间的水平间距
class IndexSvg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data_o,
    };
  }

  componentDidMount() {
    const { data } = this.state;
    this.renderSvg(data);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { data } = this.state;
    this.renderSvg(data);
  }

  // 操作 - 添加结束单元
  handleAddFinish = (svg, e, label, node, trueOrFalse) => {
    const { data } = this.state;
    const uuid = new Date().getTime();
    const finishNode = {
      id: uuid,
      type: TYPE.finish,
      prevNode: node.id,
      label: `finis所大所多多多多label,finish ${uuid}`,
      condition: "finish哒哒哒哒哒哒多多多多多",
      status: trueOrFalse === "F" ? STATUS.false : STATUS.true,
    };
    // 更改当前节点的nextLeftNode和nextRightNode
    const changeData = data.map(item => {
      if (item.id === node.id) {
        return {
          ...item,
          nextLeftNode: trueOrFalse === "F" ? item.nextLeftNode : finishNode.id,
          nextRightNode: trueOrFalse === "F" ? finishNode.id : item.nextRightNode,
        };
      }
      return item;
    });
    this.setState({ data: [...changeData, finishNode] });
  };

  // 操作 - 添加逻辑单元
  handleAddLogic = (svg, e, label, node, trueOrFalse) => {
    const { data } = this.state;
    // 新增节点
    const uuid = new Date().getTime();
    const newNode = {
      id: uuid,
      type: TYPE.rhombus,
      prevNode: node.id,
      nextLeftNode: undefined,
      nextRightNode: undefined,
      label: "xxxx",
      condition: `xxxxx: ${uuid}`,
      status: trueOrFalse === "F" ? STATUS.false : STATUS.true,
    };
    // 更改当前节点的nextLeftNode和nextRightNode
    const changeData = data.map(item => {
      if (item.id === node.id) {
        return {
          ...item,
          nextLeftNode: trueOrFalse === "F" ? item.nextLeftNode : newNode.id,
          nextRightNode: trueOrFalse === "F" ? newNode.id : item.nextRightNode,
        };
      }
      return item;
    });
    this.setState({ data: [...changeData, newNode] });
  };

  // 获取要删除的所有id
  getDeleteIds = (node, data, res = []) => {
    res.push(node.id);
    if (node.nextLeftNode) {
      const d = data.find(item => item.id === node.nextLeftNode);
      this.getDeleteIds(d, data, res);
    }
    if (node.nextRightNode) {
      const d = data.find(item => item.id === node.nextRightNode);
      this.getDeleteIds(d, data, res);
    }
    return res;
  };

  // 操作 - 删除逻辑单元
  handleDelete = (svg, e, label, node, trueOrFalse) => {
    const { data } = this.state;
    const deleteIds = this.getDeleteIds(node, data);
    const prevNode = data.find(item => item.id === node.prevNode);
    let changeData = data.map(item => {
      if (item.id === prevNode.id) {
        return {
          ...item,
          nextLeftNode: trueOrFalse === "F" ? undefined : item.nextLeftNode,
          nextRightNode: trueOrFalse === "T" ? undefined : item.nextRightNode,
        };
      }
      return item;
    });

    changeData = changeData.filter(item => !deleteIds.includes(item.id));
    this.setState({ data: changeData });
  };

  operationByType = type => {
    const plusLogicNode = {
      label: "+",
      clickFn: this.handleAddLogic,
      attr: {
        circleStroke: "#38649E",
        circleFill: "#E6F1FD",
        textFill: "#336CA8",
      },
    };
    const plusFinishNode = {
      label: "E",
      clickFn: this.handleAddFinish,
      attr: {
        circleStroke: "#38649E",
        circleFill: "#E6F1FD",
        textFill: "#336CA8",
      },
    };
    const deleteNode = {
      label: "-",
      clickFn: this.handleDelete,
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
      attr: {
        circleStroke: "red",
        circleFill: "#FCDBE0",
        textFill: "#C71723",
      },
    };
    const typeMap = {
      [TYPE.start]: [plusFinishNode, cancel, plusLogicNode],
      [TYPE.rhombus]: [plusLogicNode, cancel, plusFinishNode, deleteNode],
      [TYPE.finish]: [deleteNode, cancel],
    };
    return typeMap[type];
  };

  renderSvg = data => {
    const svg = Snap("#svgId");
    svg.clear();
    this.recursionPaint(svg, data);
  };

  logicAndCircleTextGraph = (svg, x, y, currentNode, operationObj) => {
    // 画临时文字,来获取当前文本所占的宽度和高度
    const { height } = getResponseRectTextBox(svg, 0, 0, currentNode.condition, conditionMaxWidth);
    // 绘制矩形文本
    const { rectGroup } = responseRectText(svg, x, y, currentNode.condition, conditionMaxWidth);
    // 绘制逻辑单元
    const r = logicGraph(svg, x, y, operationObj, currentNode, 0, height);
    const logicCoordinate = computeLogicPoint(x, y, height);
    return {
      g: svg.g(rectGroup, r),
      x_f: logicCoordinate.x_f,
      y_f: logicCoordinate.y_f,
      x_t: logicCoordinate.x_t,
      y_t: logicCoordinate.y_t,
    };
  };

  recursionPaint = (svg, data) => {
    let offsetRightMaxX = 0;
    // 内部递归函数
    const _innerRecursion = (currentNode, currentX, currentY, prevX, prevY) => {
      if (currentNode.type === TYPE.finish) {
        // 绘制结束操作
        const { width, height } = getResponseRectTextBox(svg, 0, 0, currentNode.label, finishMaxWidth);
        let finishX = currentX - width / 2 - 50 + 10;
        let finishY = currentY - height / 2 - 20 + verticalSpacing;
        const { rectGroup } = responseRectText(
          svg,
          finishX,
          finishY,
          currentNode.label,
          finishMaxWidth,
          0,
          "rgb(240,240,240)"
        );
        // 绑定事件
        rectGroup.click(() => {
          const { x, y, width, height } = rectGroup.getBBox();
          NodeOperation(svg, x + width / 2, y + height / 2, 65, this.operationByType(currentNode.type), "finish", currentNode, 20);
        });
        if (currentNode.status === STATUS.true) {
          arrowLine(svg, prevX, prevY, prevX, finishY-23);
        } else if (currentNode.status === STATUS.false) {
          const { cx, cy, height } = rectGroup.getBBox();
          brokenLineGraph(svg, prevX + 12, prevY, cx, cy - height / 2);
        }
        // 记录当前向右偏移量
        if (offsetRightMaxX < currentX + width / 2) {
          offsetRightMaxX = currentX + width / 2;
        }
      } else if (currentNode.type === TYPE.rhombus) {
        // 绘制逻辑单元
        const { x_t, y_t, x_f, y_f } = this.logicAndCircleTextGraph(
          svg,
          currentX,
          currentY,
          currentNode,
          this.operationByType(currentNode.type)
        );
        if (currentNode.status === STATUS.true) {
          arrowLine(svg, prevX, prevY, currentX, currentY - 10);
        } else if (currentNode.status === STATUS.false) {
          arrowLine(svg, prevX + 12, prevY, currentX - 30, currentY);
        }
        // 右偏移量与当前逻辑F节点的x坐标对比，谁大用谁
        if (offsetRightMaxX < x_f) {
          offsetRightMaxX = x_f;
        }
        const left = data.find(item => item.id === currentNode.nextLeftNode);
        if (left) {
          // 迭代左子树
          _innerRecursion(left, x_t, y_t + verticalSpacing, x_t, y_t + 12);
        }
        const right = data.find(item => item.id === currentNode.nextRightNode);
        if (right) {
          // 迭代右子树
          if (right.type === TYPE.rhombus) {
            _innerRecursion(right, offsetRightMaxX + horizontalSpacing, y_f, x_f, y_f);
          } else if (right.type === TYPE.finish) {
            _innerRecursion(right, offsetRightMaxX + horizontalSpacing, y_t + verticalSpacing, x_f, y_f);
          }
        }
        // 更新向右的偏移量
        if (x_f > offsetRightMaxX) {
          offsetRightMaxX = x_f;
        }
      }
    };
    const start = data.find(item => item.type === TYPE.start);
    // 1. 画开始节点
    const rectStart = paintRectText(svg, start.x, start.y, start.label);
    const { cx, cy, height } = rectStart.getBBox();
    // 绑定事件
    rectStart.click(() => {
      const { x, y, width, height } = rectStart.getBBox();
      NodeOperation(svg, x + width / 2, y + height / 2, 50, this.operationByType(start.type), "开始", start);
    });
    // 开始节点之后的第一个节点
    const first = data.find(item => item.id === start.nextLeftNode);
    if (first) {
      _innerRecursion(first, cx, cy + height / 2 + verticalSpacing, cx, cy + rectStart.getBBox().height / 2);
    }
  };

  render() {
    console.log(this.state.data);
    return (
      <Fragment>
        <div
          style={{
            position: "relative",
            width: 2200,
            height: 3800,
            border: "1px solid #dfdfdf",
            margin: "20px 0 0 20px",
          }}>
          <svg id="svgId" width={2200} height={3800} />
        </div>
      </Fragment>
    );
  }
}

export default IndexSvg;
