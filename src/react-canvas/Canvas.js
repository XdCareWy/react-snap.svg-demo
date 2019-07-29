import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { treeData } = this.props;
    const copyTreeData = JSON.parse(JSON.stringify(treeData));
    Canvas.transformTree(copyTreeData);
    Canvas.computeTreeDistance(copyTreeData);

    console.log(copyTreeData);

    const flatTree = Canvas.flatTree(copyTreeData);
    console.log(flatTree);

    const canvasDom = document.getElementById("canvas");
    const ctx = canvasDom.getContext("2d");
    Canvas.loopRound(ctx, copyTreeData);
    Canvas.loopLine(ctx, copyTreeData);
  }

  render() {
    return (
      <div>
        <canvas id="canvas" width={650} height={300}/>
      </div>
    );
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
