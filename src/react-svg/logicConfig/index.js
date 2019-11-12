import React, { Component, Fragment } from "react";
import treeData from "./data";
import { circleGraph, lineGraph } from "../basicGraph";
const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

class LogicConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: treeData,
    };
  }

  componentDidMount() {
    const svg = Snap("#svgId");
    svg.clear();
    const { treeData } = this.state;
    const copyTreeData = JSON.parse(JSON.stringify(treeData));
    LogicConfig.transformTree(copyTreeData);
    LogicConfig.computeTreeDistance(copyTreeData);
    LogicConfig.loopLine(svg, copyTreeData);
    LogicConfig.loopRound(svg, copyTreeData);
  }

  static loopRound(svg, data) {
    // 画节点
    for (let i = 0; i < data.length; i++) {
      const mid = data[i];

      circleGraph(svg, mid.x, mid.y, 10, mid.label);
      if (mid.children.length) {
        LogicConfig.loopRound(svg, mid.children);
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
  static computeTreeDistance(data, XGap = 50, yGap = 50, offsetY = -10, offsetX = 0) {
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
  render() {
    return (
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
    );
  }
}

export default LogicConfig;
