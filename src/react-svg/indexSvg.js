import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data_o, STATUS } from "./data1";
import { NodeOperation } from "./basicGraph/NodeOperation";
import { responseRectText, getResponseRectTextBox, paintRectText } from "./basicGraph/index";
import { logicGraph, computeLogicPoint } from "./combinationGraph/index";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

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
    const { textGroup } = responseRectText(svg, 0, 0, node.condition, 200);
    const { x_t, y_t, x_f, y_f } = computeLogicPoint(
      node.x,
      node.y,
      textGroup.getBBox().width,
      textGroup.getBBox().height / 2 + 20
    );
    let offsetX = 0;
    let offsetY = 0;
    if (trueOrFalse === "T") {
      offsetX = x_t;
      offsetY = y_t + 80;
    } else {
      offsetX = x_f + 110;
      offsetY = y_f;
    }
    textGroup.remove();
    const { data } = this.state;
    const finishNode = {
      id: data.length + 1,
      type: TYPE.finish,
      prevNode: node.id,
      nextLeftNode: undefined,
      nextRightNode: undefined,
      label: "finish哒哒哒哒哒哒多多多多多",
      condition: "finish哒哒哒哒哒哒多多多多多",
      x: offsetX,
      y: offsetY,
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
    const operationElement = e.getBBox();
    const { data } = this.state;
    let offsetX = operationElement.cx;
    let offsetY = operationElement.cy;
    if (node.type === TYPE.start) {
      offsetY = operationElement.cy + 90;
    } else {
      if (trueOrFalse === "F") {
        offsetX = operationElement.cx + 100;
        offsetY = operationElement.cy;
      } else {
        offsetX = operationElement.cx;
        offsetY = operationElement.cy + 90;
      }
    }
    // 新增节点
    const newNode = {
      id: data.length + 1,
      type: TYPE.rhombus,
      prevNode: node.id,
      nextLeftNode: undefined,
      nextRightNode: undefined,
      label: "xxxx",
      condition: `xxxxx: ${data.length + 1}`,
      x: offsetX,
      y: offsetY,
      status: STATUS.none,
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

  renderSvg = data => {
    const svg = Snap("#svgId");
    svg.clear();
    const operationObj = [
      {
        label: "+",
        clickFn: this.handleAddLogic,
        attr: {
          circleStroke: "#38649E",
          circleFill: "#E6F1FD",
          textFill: "#336CA8",
        },
      },
      {
        label: "-",
        clickFn: this.handleDelete,
        attr: {
          circleStroke: "#920000",
          circleFill: "#FCDBE0",
          textFill: "#C71723",
        },
      },
      {
        label: "E",
        clickFn: this.handleAddFinish,
        attr: {
          circleStroke: "#38649E",
          circleFill: "#E6F1FD",
          textFill: "#336CA8",
        },
      },
      {
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
      },
    ];
    this.recursionPaint(svg, data, operationObj);
  };

  logicAndCircleTextGraph = (svg, x, y, currentNode, operationObj) => {
    const lineWidth = 200; // 矩形文本框的最大宽度
    // 画临时文字,来获取当前文本所占的宽度和高度
    const { width, height } = getResponseRectTextBox(svg, 0, 0, currentNode.condition, lineWidth);
    // 绘制矩形文本
    const { rectGroup } = responseRectText(svg, x, y, currentNode.condition, lineWidth);
    // 绘制逻辑单元
    const r = logicGraph(svg, x, y, operationObj, currentNode, width, height);
    const logicCoordinate = computeLogicPoint(x, y, width, height);
    return {
      g: svg.g(rectGroup, r),
      x_f: logicCoordinate.x_f,
      y_f: logicCoordinate.y_f,
      x_t: logicCoordinate.x_t,
      y_t: logicCoordinate.y_t,
    };
  };

  recursionPaint = (svg, data, operationObj) => {
    let offsetRightMaxX = 1;
    // 内部递归函数
    const _innerRecursion = (currentNode, x, y) => {
      // 画菱形节点 - 左节点
      const { x_t, y_t, x_f, y_f } = this.logicAndCircleTextGraph(svg, x, y, currentNode, operationObj);
      let countRight = 1;
      const left = data.find(item => item.id === currentNode.nextLeftNode);
      if (left) {
        offsetRightMaxX = _innerRecursion(left, x_t, y_t + 100);
      }
      const right = data.find(item => item.id === currentNode.nextRightNode);
      if (right) {
        offsetRightMaxX = _innerRecursion(right, x_f + offsetRightMaxX * 200, y_f);
        countRight = countRight + offsetRightMaxX;
      }
      console.log(offsetRightMaxX);
      return countRight;
    };
    const top = data.find(item => item.type === TYPE.start);
    // 1. 画开始节点
    const rectStart = paintRectText(svg, top.x, top.y, top.label);
    const { cx, cy, height } = rectStart.getBBox();
    // 绑定事件
    rectStart.click(() => {
      const { x, y, width, height } = rectStart.getBBox();
      NodeOperation(svg, x + width / 2, y + height / 2, 50, operationObj, "开始", top);
    });
    const first = data.find(item => item.id === top.nextLeftNode);
    _innerRecursion(first, cx, cy + height / 2 + 100);
  };

  render() {
    console.log(this.state.data);
    return (
      <Fragment>
        <div
          style={{
            position: "relative",
            width: 1200,
            height: 800,
            border: "1px solid #dfdfdf",
            margin: "20px 0 0 20px",
          }}>
          <svg id="svgId" width={1200} height={800} />
        </div>
      </Fragment>
    );
  }
}

export default IndexSvg;
