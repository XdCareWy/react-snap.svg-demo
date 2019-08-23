import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data as sourceData } from "./data1";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const reactWidth = 60;
const reactHeight = 20;
const reactBorderRadius = 6;

class IndexSvg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNode: {},
      data: sourceData,
    };
  }

  componentDidMount() {
    const { data } = this.state;
    this.renderSvg(data);
  }

  renderSvg = data => {
    const svg = Snap("#svgId");
    for (let node of data) {
      const { id, type, prevNode, nextLeftNode, nextRightNode, label, condition, x, y } = node;
      // 类型为start时，画矩形开始图
      if (type === TYPE.start || type === TYPE.rect) {
        const rectStart = this.paintRectText(svg, type === TYPE.start?x+12:x, y, label);
        // 绑定事件
        rectStart.click(() => {
          const { x, y, width, height } = rectStart.getBBox();
          this.showOperation(x, y, width, height);
          this.setState({ selectedNode: node });
        });
      }
      // 类型为rhombus时，画菱形
      if (type === TYPE.rhombus) {
        const rhombusLogic = this.paintRhombus(svg, x, y);
        // this.paintText(svg, x, y, label);
        this.paintText(svg, x+40, y-16, condition);
        rhombusLogic.click(() => {
          const { x, y, width, height } = rhombusLogic.getBBox();
          console.log(rhombusLogic.getBBox());
          this.showOperation(x, y, width, height);
          this.setState({ selectedNode: node });
        });
      }
      // 画线
      if (nextLeftNode) {
        const { x: subX, y: subY } = data.find(item => item.id === nextLeftNode);
        this.paintLine(svg, x, y + reactHeight / 2, subX, subY - reactHeight / 2);
        svg.text(x - 25, y + (subY - y) / 2, "Yes").attr({"font-size": 12});
      }
      if (nextRightNode) {
        const { x: subX, y: subY } = data.find(item => item.id === nextRightNode);
        this.paintLine(svg, x + reactWidth / 2, y, subX - reactWidth / 2, subY);
        svg.text(x + (subX - x) / 2, y + 12, "No").attr({"font-size": 10});
      }
    }
  };

  showOperation = (left, top, width, height) => {
    const d = document.getElementById("operationDiv");
    const operation = document.getElementById("operation");
    d.style.top = `${top - 3}px`;
    d.style.left = `${left - 3}px`;
    d.style.width = `${width + 4}px`;
    d.style.height = `${height + 4}px`;
    d.style.display = "block";
    operation.style.top = `${top - 3}px`;
    operation.style.left = `${left - 3}px`;
    operation.style.width = `${width + 4}px`;
    operation.style.height = `${height + 4}px`;
    operation.style.display = "block";
  };
  hidenOperation = () => {
    const d = document.getElementById("operationDiv");
    const operation = document.getElementById("operation");
    d.style.display = "none";
    operation.style.display = "none";
  };

  paintLine = (svg, fromX, fromY, toX, toY) => {
    const p1 = svg.path("M0,0 L0,4 L3,2 L0,0").attr({
      fill: "rgb(143, 143, 143)",
    });
    const m2 = p1.marker(0, 0, 12, 12, 3, 2);
    return svg.line(fromX, fromY, toX, toY).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
      "marker-end": m2,
    });
  };

  paintRoundRect(svg, x, y) {
    return svg.rect(x - 20, y - 10, reactWidth, reactHeight, reactBorderRadius, reactBorderRadius).attr({
      fill: "white",
      stroke: "black",
      "fill-opacity": 0,
    });
  }

  paintRectText(svg, x, y, text) {
    const textE = this.paintText(svg, x, y, text);
    const {width} = textE.getBBox()
    const rectE = this.paintRect(svg, x, y, width+10);
    const g = svg.g(rectE, textE);
    // 鼠标放上去展示小手
    g.addClass("cursor-pointer");
    return g;
  }

  paintText(svg, x, y, text) {
    return svg.text(x - reactWidth / 2 + 4, y - reactHeight / 2 + 15, text).attr({
      "font-size": 12
    });
  }

  paintRect(svg, x, y, width) {
    return svg.rect(x - reactWidth / 2, y - reactHeight / 2, width, reactHeight, 0, 0).attr({
      fill: "transparent",
      stroke: "rgb(49, 208, 198)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
      rx: 2,
      ry: 2,
    });
  }

  paintRhombus = (svg, x, y) => {
    return svg
      .polyline([
        x - reactWidth / 2,
        y,
        x,
        y - reactHeight / 2,
        x + reactWidth / 2,
        y,
        x,
        y + reactHeight / 2,
        x - reactWidth / 2,
        y,
      ])
      .attr({
        class: "cursor-pointer",
        fill: "transparent",
        stroke: "rgb(124, 104, 252)",
        "stroke-width": 2,
        "stroke-dasharray": 0,
      });
  };

  handleInfo = () => {
    const { selectedNode } = this.state;
    console.log(selectedNode);
    //  todo： 展示该节点的信息
  };

  handleRemove = () => {
    const { selectedNode } = this.state;
    console.log(selectedNode);
    //  todo： 删除该节点及其子节点
  };

  handlePlus = () => {
    const { selectedNode } = this.state;
    console.log(selectedNode);
    //  todo： 增加新的节点
  };

  handleConfig = () => {
    const { selectedNode } = this.state;
    console.log(selectedNode);
    //  todo： 配置该节点的信息
  };

  render() {
    return (
      <Fragment>
        <div
          style={{
            position: "relative",
            width: 1000,
            height: 800,
            border: "1px solid #dfdfdf",
            margin: "20px 0 0 50px",
          }}>
          <svg id="svgId" width={1000} height={800} />
          <div
            id="operationDiv"
            style={{
              display: "none",
              transform: "rotate(0deg)",
            }}
            className="joint-free-transform joint-theme-modern">
            <div draggable="false" className="resize nw" data-position="top-left" />
            <div draggable="false" className="resize n" data-position="top" />
            <div draggable="false" className="resize ne" data-position="top-right" />
            <div draggable="false" className="resize e" data-position="right" />
            <div draggable="false" className="resize se" data-position="bottom-right" />
            <div draggable="false" className="resize s" data-position="bottom" />
            <div draggable="false" className="resize sw" data-position="bottom-left" />
            <div draggable="false" className="resize w" data-position="left" />
          </div>
          <div
            id="operation"
            style={{
              display: "none",
            }}
            className="join-halo">
            <div>
              <div className="info" onClick={this.handleInfo} />
              <div className="remove" onClick={this.handleRemove} />
              <div className="plus" onClick={this.handlePlus} />
              <div className="config" onClick={this.handleConfig} />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default IndexSvg;
