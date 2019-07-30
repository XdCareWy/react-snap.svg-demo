import React, { Component } from "react";
import "./canvas.css";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 650,
      height: 300,
      value: [],
      inputValue: ""
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { treeData } = props;
    const copyTreeData = JSON.parse(JSON.stringify(treeData));
    Canvas.transformTree(copyTreeData);
    Canvas.computeTreeDistance(copyTreeData);
    const flatTree = Canvas.flatTree(copyTreeData);
    const canvasW = copyTreeData[0].childNodeCount * 50;
    const canvasH = Math.max.apply(Math, flatTree.map(item => item.floor)) * 50;
    return {
      ...state,
      width: canvasW,
      height: canvasH,
      value: copyTreeData
    };
  }

  componentDidMount() {
    const { value } = this.state;
    Canvas.renderTree(value);
  }

  handleInput = e => {
    const v = e.target.value;
    this.setState({ inputValue: v });
  };

  handleOk = () => {
    const { inputValue } = this.state;
    console.log(inputValue);
  };
  handleCancel = () => {

  }

  handleCanvas = e => {
    const {value} = this.state
    const canvasDom = document.getElementById("canvas");
    let eventX = e.clientX - canvasDom.getBoundingClientRect().left;
    let eventY = e.clientY - canvasDom.getBoundingClientRect().top;
    const flatTreeData = Canvas.flatTree(value);
    const p = flatTreeData.find(node => {
      const { x, y } = node;
      return (
        Math.abs(x - eventX) < 5 * Math.sign(45) &&
        Math.abs(y - eventY) < 5 * Math.sign(45)
      );
    });
    console.log(p)
  }

  render() {
    const { width, height } = this.state;
    return (
      <div className="canvasBox">
        <canvas id="canvas" width={width} height={height} onMouseMove={this.handleCanvas} />
        <div id="operationId" className="operationBox">
          <div className="symbol">||</div>
          <div className="symbol">&&</div>
          <div className="symbol">删除</div>
        </div>
        <div className="maskBox">
          <div id="inputId">
            <input onChange={this.handleInput} type="text" />
            <button onClick={this.handleOk}>确定</button>
            <button onClick={this.handleCancel}>取消</button>
          </div>
        </div>
      </div>
    );
  }

  static renderTree(value) {
    const canvasDom = document.getElementById("canvas");
    const ctx = canvasDom.getContext("2d");
    Canvas.loopRound(ctx, value);
    Canvas.loopLine(ctx, value);
    const operation = document.getElementById("operationId");
    const inputDom = document.getElementById("inputId");
    const flatTree = Canvas.flatTree(value);
    // 绑定鼠标悬停事件
    canvasDom.addEventListener("mousemove", e => {
      console.log(`aaa: ${e.clientX}`)
      console.log(`canvasDom: ${canvasDom.getBoundingClientRect().left}`)
      let eventX = e.clientX - canvasDom.getBoundingClientRect().left;
      let eventY = e.clientY - canvasDom.getBoundingClientRect().top;
      const p = flatTree.find(node => {
        const { x, y } = node;
        return (
          Math.abs(x - eventX) < 5 * Math.sign(45) &&
          Math.abs(y - eventY) < 5 * Math.sign(45)
        );
      });
      if (p) {
        operation.style.left = `${p.x - 50}px`;
        operation.style.top = `${p.y - 20}px`;
        operation.style.display = "block";
        operation.addEventListener("click", e => {
          operation.style.display = "none";
          inputDom.parentElement.style.display = "block";
          inputDom.style.left = `${p.x - 50}px`;
          inputDom.style.top = `${p.y - 15}px`;
          inputDom.style.display = "block";
        });
      } else {
        operation.style.display = "none";
      }
    });
  }

  static loopRound(ctx, data) {
    // 画节点
    for (let i = 0; i < data.length; i++) {
      const mid = data[i];

      Canvas.paintRound(ctx, { x: mid.x, y: mid.y });
      ctx.font = "10px STheiti, SimHei";
      ctx.fillText(mid.label, mid.x + 3, mid.y - 3);
      if (mid.children.length) {
        Canvas.loopRound(ctx, mid.children);
      }
    }
  }
  static loopLine(ctx, data) {
    // 画直线
    for (let node of data) {
      if (node.children.length) {
        for (let subNode of node.children) {
          Canvas.paintStraightLine(ctx, node, subNode);
        }
        Canvas.loopLine(ctx, node.children);
      }
    }
  }

  /**
   * 画圆弧
   * @param ctx
   * @param config = {
   *   x, 圆弧x坐标 number
   *   y, 圆弧y坐标 number
   *   radius, 圆弧的半径 number
   *   startAngle, 圆弧开始位置 number
   *   endAngle, 圆弧结束位置 number
   *   anticlockwise, false: 顺时针；true：逆时针
   *
   * }
   */
  static paintArc(ctx, config) {
    const {
      x,
      y,
      radius,
      startAngle,
      endAngle,
      anticlockwise = false
    } = config;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    ctx.stroke();
  }

  /**
   * 画圆
   * @param ctx
   * @param config = {
   *   x, 圆心x坐标
   *   y, 圆心y坐标
   *   radius, 圆半径，默认5
   * }
   */
  static paintRound(ctx, config) {
    Canvas.paintArc(ctx, {
      anticlockwise: false,
      endAngle: 2 * Math.PI,
      radius: 5,
      startAngle: 0,
      ...config
    });
  }

  /**
   * 画直线
   * @param ctx
   * @param startPoint = {x, y} 开始点
   * @param endPoint = {x, y} 终止点
   */
  static paintStraightLine(ctx, startPoint, endPoint) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
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
        const leafCount = Canvas.transformTree(node.children, floor + 1);
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
  static computeTreeDistance(
    data,
    XGap = 50,
    yGap = 50,
    offsetY = -10,
    offsetX = 0
  ) {
    for (let node of data) {
      node.y = node.floor * yGap + offsetY;
      node.x =
        node.childNodeCount * XGap * 0.5 + node.floorNumber * XGap + offsetX;
      if (node.children.length) {
        Canvas.computeTreeDistance(
          node.children,
          XGap,
          yGap,
          offsetY,
          node.floorNumber * XGap + offsetX
        );
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
        Canvas.flatTree(subNode, flatRes);
      }
    }
    return flatRes;
  }
}

export default Canvas;
