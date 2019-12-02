import React, { Component, Fragment } from "react";
import { Modal, message, Input, Form } from "antd";
import NodeOperation from "./common/NodeOperationGraph";
import {
  responseRectText,
  getResponseRectTextBox,
  paintRectText,
  arrowLine,
  brokenLineGraph,
} from "./common/BasicGraph";
import { logicGraph, computeLogicPoint } from "./common/LogicGraph";
import {
  TYPE,
  STATUS,
  ACTIVITY_COLOR,
  LOGIC_TYPE,
  startPoint,
  disabledAttr,
  addAttr,
  cancelAttr,
  configAttr,
  deleteAttr,
  finishAttr,
} from "./constants";
import RenderExpression from "./RenderExpression";

const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

const finishMaxWidth = 100; // 结束节点最大宽度
const conditionMaxWidth = 200; // 条件表达式最大宽度
const verticalSpacing = 60; // 节点之间的垂直间距
const horizontalSpacing = 100; // 节点之间的水平间距
export default class RenderLogic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value.length
        ? props.value
        : [
            {
              id: 1,
              type: 1,
              nextLeftNode: undefined,
              label: "开始",
              condition: "",
              status: 0,
              isActivity: false,
            },
          ],
      visible: false,
      currentLogicNode: {},
      childContext: null,
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
    if (node.type === TYPE.rhombus && !node.condition) {
      message.destroy();
      message.warn("请先配置该逻辑单元");
    } else {
      const { data } = this.state;
      const uuid = new Date().getTime();
      const finishNode = {
        id: uuid,
        type: TYPE.finish,
        prevNode: node.id,
        label: "请配置完成节点",
        condition: undefined,
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
    }
  };

  // 操作 - 添加逻辑单元
  handleAddLogic = (svg, e, label, node, trueOrFalse) => {
    if (node.type === TYPE.rhombus && !node.condition) {
      message.destroy();
      message.warn("请先配置该逻辑单元");
    } else {
      const { data } = this.state;
      // 新增节点
      const uuid = new Date().getTime();
      const newNode = {
        id: uuid,
        type: TYPE.rhombus,
        prevNode: node.id,
        nextLeftNode: undefined,
        nextRightNode: undefined,
        label: "逻辑单元",
        condition: undefined,
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
    }
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
  handleDelete = (svg, e, label, node) => {
    Modal.confirm({
      title: "删除",
      content: "删除该节点及其所有子孙节点，确定删除吗？",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        const { data } = this.state;
        const deleteIds = this.getDeleteIds(node, data);
        const prevNode = data.find(item => item.id === node.prevNode);
        // 过滤该节点，以及所有子孙节点
        let changeData = data.filter(item => !deleteIds.includes(item.id));
        // 对该节点的父节点的指向进行重置
        changeData = changeData.map(item => {
          if (item.id === prevNode.id) {
            const left = changeData.find(item => item.id === prevNode.nextLeftNode) || {};
            const right = changeData.find(item => item.id === prevNode.nextRightNode) || {};
            return {
              ...item,
              nextLeftNode: left.id,
              nextRightNode: right.id,
            };
          }
          return item;
        });
        this.setState({ data: changeData });
      },
    });
  };

  handleConfigLogic = (svg, e, label, node) => {
    this.setState({ visible: true, currentLogicNode: node });
  };

  operationByType = (type, isDisabled) => {
    const configLogicNode = {
      label: "S",
      clickFn: this.handleConfigLogic,
      titleTips: "配置逻辑单元",
      attr: !isDisabled ? disabledAttr : configAttr,
      className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    };
    const plusLogicNode = {
      label: "+",
      clickFn: this.handleAddLogic,
      titleTips: "新增逻辑节点",
      attr: !isDisabled ? disabledAttr : addAttr,
      className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    };
    const plusFinishNode = {
      label: "E",
      clickFn: this.handleAddFinish,
      titleTips: "新增完成节点",
      attr: !isDisabled ? disabledAttr : finishAttr,
      className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
    };
    const deleteNode = {
      label: "-",
      clickFn: this.handleDelete,
      titleTips: "删除节点",
      attr: deleteAttr,
    };
    const cancel = {
      label: "C",
      clickFn: function(svg) {
        const r = svg.select("#operationId");
        r.remove();
      },
      titleTips: "取消操作",
      attr: cancelAttr,
    };
    const typeMap = {
      [TYPE.start]: [plusFinishNode, cancel, plusLogicNode],
      [TYPE.rhombus]: [plusLogicNode, cancel, plusFinishNode, configLogicNode, deleteNode],
      [TYPE.finish]: [deleteNode, configLogicNode, cancel],
    };
    return typeMap[type];
  };

  renderSvg = data => {
    const svg = Snap("#svgId");
    svg.clear();
    this.recursionPaint(svg, data);
  };

  // 逻辑单元和矩形文本
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
    const _innerRecursion = (currentNode, currentX, currentY, prevX, prevY, prevActivity) => {
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
          "rgb(240,240,240)",
          currentNode.isActivity ? ACTIVITY_COLOR : undefined
        );
        // 绑定事件
        rectGroup.click(() => {
          const { x, y, width, height } = rectGroup.getBBox();
          const isDisabled = currentNode.nextLeftNode === undefined;
          NodeOperation(
            svg,
            x + width / 2,
            y + height / 2,
            65,
            this.operationByType(currentNode.type, isDisabled),
            "finish",
            currentNode,
            20
          );
        });
        if (currentNode.status === STATUS.true) {
          arrowLine(
            svg,
            prevX,
            prevY,
            prevX,
            finishY - 23,
            prevActivity && currentNode.isActivity ? ACTIVITY_COLOR : undefined
          );
        } else if (currentNode.status === STATUS.false) {
          const { cx, cy, height } = rectGroup.getBBox();
          brokenLineGraph(
            svg,
            prevX + 12,
            prevY,
            cx,
            cy - height / 2,
            prevActivity === false && currentNode.isActivity ? ACTIVITY_COLOR : undefined
          );
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
          this.operationByType(currentNode.type, true)
        );
        if (currentNode.status === STATUS.true) {
          arrowLine(svg, prevX, prevY, currentX, currentY - 10, prevActivity ? ACTIVITY_COLOR : undefined);
        } else if (currentNode.status === STATUS.false) {
          arrowLine(
            svg,
            prevX + 12,
            prevY,
            currentX - 30,
            currentY,
            prevActivity === false ? ACTIVITY_COLOR : undefined
          );
        }
        // 右偏移量与当前逻辑F节点的x坐标对比，谁大用谁
        if (offsetRightMaxX < x_f) {
          offsetRightMaxX = x_f;
        }
        const left = data.find(item => item.id === currentNode.nextLeftNode);
        if (left) {
          // 迭代左子树
          _innerRecursion(left, x_t, y_t + verticalSpacing, x_t, y_t + 12, currentNode.isActivity);
        }
        const right = data.find(item => item.id === currentNode.nextRightNode);
        if (right) {
          // 迭代右子树
          if (right.type === TYPE.rhombus) {
            _innerRecursion(right, offsetRightMaxX + horizontalSpacing, y_f, x_f, y_f, currentNode.isActivity);
          } else if (right.type === TYPE.finish) {
            _innerRecursion(
              right,
              offsetRightMaxX + horizontalSpacing,
              y_t + verticalSpacing,
              x_f,
              y_f,
              currentNode.isActivity
            );
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
    const rectStart = paintRectText(
      svg,
      startPoint.x,
      startPoint.y,
      start.label,
      start.isActivity ? ACTIVITY_COLOR : undefined
    );
    const { cx, cy, height } = rectStart.getBBox();
    // 绑定事件
    rectStart.click(() => {
      const { x, y, width, height } = rectStart.getBBox();
      const isDisabled = start.nextLeftNode === undefined;
      NodeOperation(
        svg,
        x + width / 2,
        y + height / 2,
        50,
        this.operationByType(start.type, isDisabled),
        "开始",
        start
      );
    });
    // 开始节点之后的第一个节点
    const first = data.find(item => item.id === start.nextLeftNode);
    if (first) {
      _innerRecursion(
        first,
        cx,
        cy + height / 2 + verticalSpacing,
        cx,
        cy + rectStart.getBBox().height / 2,
        start.isActivity
      );
    }
  };

  renderInput = data => {
    return (
      <div
        style={{
          border: "1px solid #dfdfdf",
          margin: "20px 0 0 20px",
        }}>
        <Form>
          {data.map(item => {
            if (item.type === TYPE.rhombus) {
              const { logicUnitData = [] } = item;
              return logicUnitData.map(i => {
                if (i.type === 3) {
                  const { unitValue = {} } = i || {};
                  const { leftStyle, leftValue } = unitValue;
                  if (+leftStyle === 1) {
                    return (
                      <Form.Item label={leftValue.join(".")}>
                        <Input />
                      </Form.Item>
                    );
                  }
                }
              });
            }
          })}
        </Form>
      </div>
    );
  };

  getComputeResult = (data, parentType) => {
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
    const { visible, currentLogicNode, data } = this.state;
    return (
      <Fragment>
        {
          // this.renderInput(data)
        }
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
        {visible && (
          <Modal
            okText="确定"
            cancelText="取消"
            width={800}
            title={"配置逻辑"}
            visible={visible}
            onCancel={() => this.setState({ visible: false })}
            onOk={() => {
              const { data, currentLogicNode, inputValue, childContext } = this.state;
              if(childContext.getAllResult()) {
                const changeData = data.map(item => {
                  if (item.id === currentLogicNode.id && currentLogicNode.type === TYPE.rhombus) {
                    if (!childContext.getAllResult()) return item;
                    const { logicUnitData, expressStr } = childContext.getAllResult();
                    return {
                      ...item,
                      condition: expressStr,
                      logicUnitData: logicUnitData,
                    };
                  }
                  if (item.id === currentLogicNode.id && currentLogicNode.type === TYPE.finish) {
                    return {
                      ...item,
                      label: inputValue,
                      condition: inputValue,
                    };
                  }
                  return item;
                });
                this.setState({ visible: false, data: changeData });
              }
            }}>
            {currentLogicNode.type === TYPE.finish && (
              <Fragment>
                使用输入框模拟配置
                <Input onChange={e => this.setState({ inputValue: e.target.value })} />
              </Fragment>
            )}
            {currentLogicNode.type === TYPE.rhombus && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 600,
                  overflow: "auto",
                }}>
                <RenderExpression
                  value={currentLogicNode.logicUnitData}
                  getChild={context => this.setState({ childContext: context })}
                />
              </div>
            )}
          </Modal>
        )}
      </Fragment>
    );
  }
}
