import React, { Component, Fragment } from "react";
import "./index.css";
import { TYPE, data_o, STATUS } from "./data1";
import { NodeOperation } from "./basicGraph/NodeOperation";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const reactWidth = 60;
const reactHeight = 20;

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

  // 画圆形里带文字的图
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
  // 计算逻辑单元的关键点的位置
  computeLogic = (x, y, width = 100, height = 50) => {
    const w = width < 100 ? 100 : width;
    const h = height < 50 ? 50 : height;
    const x_c = x;
    const y_c = y + h;
    const x_t = x;
    const y_t = y_c + 50;
    const x_f = x_c + w;
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
  // 画逻辑单元
  paintLogicUnit = (svg, x, y, operationObj, node, spaceWidth, spaceHeight) => {
    const { x_f, y_f, x_c, y_c, x_t, y_t } = this.computeLogic(x, y, spaceWidth, spaceHeight);
    // 1. 菱形 - 连接点 的line
    const rhombusToCenterLine = svg.line(x, y, x_c, y_c).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });
    // 2. 连接点 - F 的line
    const centerToFalseLine = svg.line(x_c, y_c, x_f, y_f).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });
    // 3. 连接点 - T 的line
    const centerToTrueLine = svg.line(x_c, y_c, x_t, y_t).attr({
      fill: "transparent",
      stroke: "rgb(143, 143, 143)",
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });

    // 1. 画菱形
    const rhombusE = this.paintRhombus(svg, x, y);
    // 3. 画连接点
    const centerE = this.paintRoundText(svg, x_c, y_c, 5);
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
    return svg.g(rhombusToCenterLine, centerToFalseLine, centerToTrueLine, rhombusE, centerE, trueE, falseE);
  };

  // 操作 - 添加结束单元
  handleAddFinish = (svg, e, label, node, trueOrFalse) => {
    const { textGroup } = this.paintResponseRectText(svg, 0, 0, node.condition, 200);
    const { x_t, y_t, x_f, y_f } = this.computeLogic(
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
      type: TYPE.rect,
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
      condition: `xxxxid: ${data.length + 1}`,
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

  // 画根据宽度自动换行的矩形文本
  paintResponseRectText = (
    svg,
    x,
    y,
    text = "在逻辑配置中进行配置",
    lineWidth = 100,
    offsetX = 0,
    offsetY = 0,
    dasharray = 3
  ) => {
    if (!text)
      return {
        rectGroup: undefined,
        textGroup: undefined,
      };
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
      "stroke-dasharray": dasharray,
      rx: 10,
      ry: 10,
    });
    return {
      rectGroup: svg.g(rectElement, textGroup),
      textGroup: textGroup,
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
    // 对数进行深度优先遍历
    let offsetRightMaxX = 0;
    const lineXY = []; // 记录所有连接点的位置，最后跟库此数组画箭头
    const stack = []; // 模拟一个栈
    const result = []; // 存放遍历后的结果
    const root = data.find(item => item.type === TYPE.start); // 找到根节点
    stack.push(root); // 将根节点放到栈中
    while (stack.length) {
      const top = stack.pop(); // 取出栈中的顶部元素
      /********* 判断其类型，并画出对应的构图 start **********/
      if (top.type === TYPE.start) {
        const rectStart = this.paintRectText(svg, top.x, top.y, top.label);
        const { cx, cy, height } = rectStart.getBBox();
        lineXY.push({
          id: top.id,
          x: cx,
          y: cy + height / 2,
          type: top.type,
          left: top.nextLeftNode,
          right: top.nextRightNode,
        });
        // 绑定事件
        rectStart.click(() => {
          const { x, y, width, height } = rectStart.getBBox();
          NodeOperation(svg, x + width / 2, y + height / 2, 50, operationObj, "开始", top);
        });
      }
      // 类型为rhombus时，画菱形
      if (top.type === TYPE.rhombus) {
        // 画临时文字,来获取当前文本所占的宽度和高度
        const { rectGroup: tmpRectGroup, textGroup: tmpTextGroup } = this.paintResponseRectText(
          svg,
          0,
          0,
          top.condition,
          lineWidth
        );
        const { width: tmpWidth = 0, height: tmpHeight = 0 } = tmpTextGroup ? tmpTextGroup.getBBox() : {};
        // 画矩形文字最终的位置
        const { rectGroup } = this.paintResponseRectText(
          svg,
          top.x,
          top.y,
          top.condition,
          tmpWidth,
          offsetX,
          -tmpHeight / 2
        );
        const { x: lastX, width: lastW } = rectGroup.getBBox();
        if (offsetRightMaxX < lastX + lastW) {
          offsetRightMaxX = lastX + lastW;
        }
        // 画菱形
        this.paintLogicUnit(svg, top.x, top.y, operationObj, top, tmpWidth, tmpHeight / 2 + 20);
        const logicCoordinate = this.computeLogic(top.x, top.y, tmpWidth, tmpHeight / 2 + 20);
        lineXY.push({
          id: top.id,
          x: logicCoordinate.x,
          y: logicCoordinate.y,
          x_t: logicCoordinate.x_t,
          y_t: logicCoordinate.y_t + 12,
          x_f: logicCoordinate.x_f + 12,
          y_f: logicCoordinate.y_f,
          type: top.type,
          left: top.nextLeftNode,
          right: top.nextRightNode,
        });
        tmpRectGroup && tmpRectGroup.remove();
      }
      /********* 判断其类型，并画出对应的构图 end  **********/
      result.push(top); // 将遍历过的节点放到result中
      // 找出当前节点的右子树的根节点，如果存在，将其放到栈中
      const rightChild = data.find(item => item.id === top.nextRightNode);
      if (rightChild) stack.push(rightChild);
      // 找出当前节点的左子树的根节点，如果存在，将其放到栈中
      const leftChild = data.find(item => item.id === top.nextLeftNode);
      if (leftChild) stack.push(leftChild);
    }
    for (let line of lineXY) {
      const { x, y, type, left, right, x_t, y_t, x_f, y_f } = line;
      if (left) {
        const leftCoordinate = lineXY.find(item => item.id === left);
        if (type === TYPE.start && leftCoordinate.type === TYPE.rhombus) {
          this.paintLine(svg, x, y, leftCoordinate.x, leftCoordinate.y - reactHeight / 2);
        } else if (type === TYPE.rhombus && leftCoordinate.type === TYPE.rhombus) {
          this.paintLine(svg, x_t, y_t, leftCoordinate.x, leftCoordinate.y - reactHeight / 2);
        }
      }
      if (right) {
        const rightCoordinate = lineXY.find(item => item.id === right);
        if (type === TYPE.rhombus && rightCoordinate.type === TYPE.rhombus) {
          this.paintLine(svg, x_f, y_f, rightCoordinate.x - reactWidth / 2, rightCoordinate.y);
        }
      }
    }
    console.log(offsetRightMaxX);

  };

  // 带箭头的线
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

  // 画开始/结束的带文本的圆角矩形
  paintRectText(svg, x, y, text) {
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

  // 画菱形单元
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
