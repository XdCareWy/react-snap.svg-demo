import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data_o, STATUS } from "./data1";
import { NodeOperation } from "./basicGraph/NodeOperation";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const reactWidth = 60;
const reactHeight = 20;
const reactBorderRadius = 6;

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
  computeLogic = (x, y, width = 100, height = 50) => {
    const w = width < 100 ? 100 : width;
    const h = height < 50 ? 50 : height;
    const x_c = x;
    const y_c = y + h;
    const x_t = x;
    const y_t = y + 2 * h;
    const x_f = x + w;
    const y_f = y + h;
    return {
      x,
      y,
      x_c,
      y_c,
      x_f,
      y_f,
      x_t,
      y_t,
    };
  };
  paintLogicUnit = (svg, x, y, operationObj, node, spaceWidth, spaceHeight) => {
    const { x_f, y_f, x_c, y_c, x_t, y_t } = this.computeLogic(x, y, spaceWidth, spaceHeight);
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
    const { data } = this.state;
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
      id: data.length + 1,
      type: TYPE.rhombus,
      prevNode: node.id,
      nextLeftNode: undefined,
      nextRightNode: undefined,
      label: "xxxx",
      condition: "xxxx",
      x: offsetX,
      y: offsetY,
      status: STATUS.true,
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

  paintResponseRectText = (svg, x, y, text, lineWidth = 100, offsetX = 0, offsetY = 0) => {
    const words = text.split("").reverse();
    let line = [];
    let textX = x + offsetX; // 文本实际绘制的x坐标
    let textY = y + offsetY; // 文本实际绘制的y坐标
    let lineHeightSpace = 0; // 单行文本的高度
    let word = words.pop();
    const allTextElements = [];
    while (word) {
      line.push(word);
      const tmpText = svg.text(0, 0, line.join("")).attr({ "font-size": 12 });
      lineHeightSpace = tmpText.getBBox().height;
      if (tmpText.getBBox().width > lineWidth) {
        line.pop();
        // 绘制当前的文字
        const realText = svg.text(textX, textY, line.join("")).attr({ "font-size": 12 });
        allTextElements.push(realText);
        // 重置到下一行
        line = [word];
        // 设置下一行的y坐标
        textY = textY + lineHeightSpace;
      }
      tmpText.remove();
      word = words.pop();
    }
    // 绘制剩下的文字
    const lastRealText = svg.text(textX, textY, line.join("")).attr({ "font-size": 12 });
    allTextElements.push(lastRealText);
    // 将所有text放到一个组里
    const textGroup = svg.g(...allTextElements);
    // 根据文本字的宽高来确定外围方框的位置
    const { x: gx, y: gy, width, height } = textGroup.getBBox();
    const [rectX, rectY, rectWidth, rectHeight] = [gx - 10, gy - 10, width + 20, height + 20];
    const rectElement = svg.rect(rectX, rectY, rectWidth, rectHeight, 0, 0).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 3,
    });
    return {
      rectGroup: svg.g(rectElement, textGroup),
      textGroup: textGroup
    };
  };

  renderSvg = data => {
    const svg = Snap("#svgId");
    const lineWidth = 200; // 矩形文本框的最大宽度
    const offsetX = 50; // 矩形文本框x坐标偏移量
    let offsetY = -20; // 矩形文本框y坐标偏移量
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
        /************** 画文字 ******************/
        const {rectGroup, textGroup: tmp} = this.paintResponseRectText(svg, x, y, condition, lineWidth, offsetX, offsetY);
        console.log(tmp.getBBox());
        const { width: tmpwidth, height: tmpHeight, cy: tmpCy } = tmp.getBBox();
        if(tmpCy > y) {
          offsetY = y - tmpCy;
        }else {
          offsetY = tmpCy - y;
        }
        this.paintResponseRectText(svg, x, y, condition, lineWidth, offsetX, -tmpHeight/2);
        rectGroup.remove();
        // 画菱形
        this.paintLogicUnit(svg, x, y, operationObj, node, lineWidth);
      }
      // 画线
      if (nextLeftNode) {
        const { x: subX, y: subY, type: subType } = data.find(item => item.id === nextLeftNode) || {};
        if (type === TYPE.start && subType === TYPE.rhombus && subX && subY) {
          this.paintLine(svg, x, y + reactHeight / 2, subX, subY - reactHeight / 2);
        } else if (type === TYPE.rhombus && subType === TYPE.rhombus) {
          const { x_t: startX, y_t: startY } = this.computeLogic(x, y);
          this.paintLine(svg, startX, startY + reactHeight / 2, subX, subY - reactHeight / 2);
        } else {
          //  rect
        }
      }
      if (nextRightNode) {
        const { x: subX, y: subY, type: subType } = data.find(item => item.id === nextRightNode) || {};
        if (type === TYPE.rhombus && subType === TYPE.rhombus) {
          const { x_f: startX, y_f: startY } = this.computeLogic(x, y, 200);
          this.paintLine(svg, startX + 12, startY, subX - reactWidth / 2, subY);
        } else {
          //  rect
        }
      }
    }
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

  render() {
    // console.log(this.state.data);
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
        </div>
      </Fragment>
    );
  }
}

export default IndexSvg;
