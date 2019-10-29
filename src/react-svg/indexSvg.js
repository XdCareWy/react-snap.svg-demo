import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data as sourceData, data_o, STATUS } from "./data1";
import { NodeOperation } from "./basicGraph/NodeOperation";

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
      dataO: data_o,
      flag: false,
    };
  }

  componentDidMount() {
    const { dataO } = this.state;
    this.renderSvgO(dataO);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { data, dataO, flag } = this.state;
    if (flag) {
      this.renderSvg(data);
    } else {
      this.renderSvgO(dataO);
    }
  }

  paintRoundText = (svg, x, y, r, text, id = "") => {
    const textSvg = svg.text(x, y, text).attr({
      class: "text-center",
    });
    const roundSvg = svg.circle(x, y, r).attr({
      fill: "rgb(215,216,217)",
      "stroke-width": 1,
      "stroke-dasharray": 0,
      stroke: "gray",
    });

    const g = svg.g(roundSvg, textSvg).attr({ id: id });
    g.hover(
      function() {
        g.select("circle").animate({ r: r + 2 }, 100);
      },
      function() {
        g.select("circle").animate({ r: r }, 100);
      }
    );
    return g;
  };

  logicUnit = (svg, x, y, operationObj, node) => {
    const w = 100;
    const h = 50;
    const x_c = x;
    const y_c = y + h;
    const x_t = x;
    const y_t = y + 2 * h;
    const x_f = x + w;
    const y_f = y + h;

    // 1. 菱形 - 连接点 的line
    svg.line(x, y, x_c, y_c).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });
    // 2. 连接点 - F 的line
    svg.line(x_c, y_c, x_f, y_f).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });
    // 3. 连接点 - T 的line
    svg.line(x_c, y_c, x_t, y_t).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });

    // 1. 画菱形
    this.paintRhombus(svg, x, y);
    // 3. 画连接点
    this.paintRoundText(svg, x_c, y_c, 5);
    // 4. 画F
    const falseE = this.paintRoundText(svg, x_f, y_f, 12, "F", "F");
    falseE.click(() => {
      NodeOperation(svg, x_f, y_f, 50, operationObj, "F", node);
    });
    // 5. 画T
    const trueE = this.paintRoundText(svg, x_t, y_t, 12, "T", "T");
    trueE.click(() => {
      NodeOperation(svg, x_t, y_t, 50, operationObj, "T", node);
    });
  };

  handleAddLogic = (svg, e, label, node, trueOrFalse) => {
    const operationElement = e.getBBox();
    console.log(operationElement);
    const { dataO } = this.state;
    let offsetX = operationElement.cx;
    let offsetY = operationElement.cy;
    if (node.type === TYPE.start) {
      offsetY = operationElement.cy + 60;
    } else {
      if (trueOrFalse === "F") {
        offsetX = operationElement.cx + 100;
        offsetY = operationElement.cy;
      } else {
        offsetX = operationElement.cx;
        offsetY = operationElement.cy + 60;
      }
    }
    // 新增节点
    const newNode = {
      id: dataO.length + 1,
      type: TYPE.rhombus,
      prevNode: node.id,
      nextLeftNode: undefined,
      nextRightNode: undefined,
      label: "xxxx",
      condition: "xxx",
      x: offsetX,
      y: offsetY,
      status: STATUS.true,
    };
    // 更改当前节点的nextLeftNode和nextRightNode
    const changeData = dataO.map(item => {
      if (item.id === node.id) {
        return {
          ...item,
          nextLeftNode: trueOrFalse === "F" ? undefined : newNode.id,
          nextRightNode: trueOrFalse === "F" ? newNode.id : undefined,
        };
      }
      return item;
    });
    this.setState({ dataO: [...changeData, newNode] });
  };

  renderSvgO = data => {
    const svg = Snap("#svgId");
    svg.clear();
    /****************开始*******************/
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
        clickFn: function(svg, e, label) {
          console.log(label);
        },
        attr: {
          circleStroke: "#920000",
          circleFill: "#FCDBE0",
          textFill: "#C71723",
        },
      },
      {
        label: "E",
        clickFn: function(svg, e, label) {
          console.log(label);
        },
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
    // 根据数据进行渲染
    for (let node of data) {
      const { id, type, prevNode, nextLeftNode, nextRightNode, label, condition, x, y } = node;
      // 类型为start时，画矩形开始图
      if (type === TYPE.start || type === TYPE.rect) {
        const rectStart = this.paintRectTextO(svg, x, y, label);
        // 绑定事件
        rectStart.click(() => {
          const { x, y, width, height } = rectStart.getBBox();
          NodeOperation(svg, x + width / 2, y + height / 2, 50, operationObj, "开始", node);
        });
      }
      // 类型为rhombus时，画菱形
      if (type === TYPE.rhombus) {
        this.logicUnit(svg, x, y, operationObj, node);
      }
      // 画线
      if (nextLeftNode) {
        const { x: subX, y: subY } = data.find(item => item.id === nextLeftNode) || {};
        if (subX && subY) {
          this.paintLine(svg, x, y + reactHeight / 2, subX, subY - reactHeight / 2);
        }
      }
      if (nextRightNode) {
        const { x: subX, y: subY } = data.find(item => item.id === nextRightNode);
        if (subX && subY) {
          this.paintLine(svg, x + reactWidth / 2, y, subX - reactWidth / 2, subY);
        }
      }
    }
    /****************结束*******************/
  };

  renderSvg = data => {
    const svg = Snap("#svgId");
    svg.clear();
    for (let node of data) {
      const { id, type, prevNode, nextLeftNode, nextRightNode, label, condition, x, y } = node;
      // 类型为start时，画矩形开始图
      if (type === TYPE.start || type === TYPE.rect) {
        const rectStart = this.paintRectText(svg, type === TYPE.start ? x + 12 : x, y, label);
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
        this.paintText(svg, x + 40, y - 16, condition);
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
        svg.text(x - 25, y + (subY - y) / 2, "Yes").attr({ "font-size": 12 });
      }
      if (nextRightNode) {
        const { x: subX, y: subY } = data.find(item => item.id === nextRightNode);
        this.paintLine(svg, x + reactWidth / 2, y, subX - reactWidth / 2, subY);
        svg.text(x + (subX - x) / 2, y + 12, "No").attr({ "font-size": 10 });
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

  paintRectTextO(svg, x, y, text) {
    const textE = svg.text(x, y, text).attr({ "font-size": 16 });
    const { width, height } = textE.getBBox();
    const textE1 = svg.text(x, y, text).attr({ "font-size": 12, class: "text-center" });
    const rectE = svg.rect(x - width / 2, y - height / 2, width, height).attr({
      fill: "rgb(244,244,244)",
      stroke: "gray",
      "stroke-width": 1,
      "stroke-dasharray": 0,
      rx: 2,
      ry: 2,
    });
    textE.remove();
    const g = svg.g(rectE, textE1);
    // 鼠标放上去展示小手
    g.attr({
      class: "text-center",
    });
    return g;
  }

  paintRectText(svg, x, y, text) {
    const textE = this.paintText(svg, x, y, text);
    const { width } = textE.getBBox();
    const rectE = this.paintRect(svg, x, y, width + 10);
    const g = svg.g(rectE, textE);
    // 鼠标放上去展示小手
    g.addClass("cursor-pointer");
    return g;
  }

  paintText(svg, x, y, text) {
    return svg.text(x - reactWidth / 2 + 4, y - reactHeight / 2 + 15, text).attr({
      "font-size": 12,
    });
  }

  paintRect(svg, x, y, width) {
    const reactWidth = 60;
    const reactHeight = 20;
    return svg.rect(x - reactWidth / 2, y - reactHeight / 2, width * 1.3, reactHeight, 0, 0).attr({
      fill: "rgb(244,244,244)",
      stroke: "gray",
      "stroke-width": 1,
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
        fill: "rgb(244,244,244)",
        stroke: "gray",
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
    console.log(this.state.dataO);
    return (
      <Fragment>
        <button
          onClick={() => {
            this.setState({ flag: !this.state.flag });
          }}>
          切换
        </button>
        <div
          style={{
            position: "relative",
            width: 1000,
            height: 800,
            border: "1px solid #dfdfdf",
            margin: "20px 0 0 20px",
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
