// 画逻辑单元
import { NodeOperation } from "../basicGraph/NodeOperation";
import { rhombusGraph, lineGraph, circleGraph } from "../basicGraph/index";

/**
 * 逻辑可视化 - 复合图形的计算单元 - 计算菱形关键点的文字
 * 菱形的中心点x，y
 * 菱形连接点 - 中心点x_c，y_c
 * 菱形连接点 - T点x_t，y_t
 * 菱形连接点 - F点x_f，y_f
 * @param x 菱形中心点x坐标
 * @param y 菱形中心点y坐标
 // * @param offsetCenterX 中心连接点偏离菱形y轴的距离
 * @param offsetCenterY 中心连接点偏离菱形x轴的距离
 * @returns {{y_f: *, x: *, y: *, y_c: *, x_t: *, x_c: *, x_f: *, y_t: *}}
 */
export const computeLogicPoint = (x, y, offsetCenterY = 50) => {
  const w = 150;
  // const w = offsetCenterX < 150 ? 150 : offsetCenterX;
  const h = offsetCenterY < 50 ? 50 : offsetCenterY;
  const x_c = x;
  const y_c = y + h;
  const x_t = x;
  const y_t = y_c + 50;
  const x_f = x_c + w;
  const y_f = y_c + 0;
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

/**
 * 逻辑可视化 - 组合图形 - 逻辑单元图形
 * @param svg
 * @param x 逻辑单元中菱形中心点x坐标
 * @param y 逻辑单元中菱形中心点y坐标
 * @param operationObj 逻辑单元的操作
 * @param node 逻辑单元当前节点数据
 * @param offsetCenterX 中心连接点偏离菱形y轴的距离
 * @param offsetCenterY 中心连接点偏离菱形x轴的距离
 * @returns {React.ReactSVGElement | never}
 */
export const logicGraph = (svg, x, y, operationObj, node, offsetCenterX, offsetCenterY) => {
  const disabledAttr = {
    circleStroke: "#d9d9d9",
    circleFill: "#f5f5f5",
    textFill: "rgba(0,0,0,0.25)",
  };
  const { x_f, y_f, x_c, y_c, x_t, y_t } = computeLogicPoint(x, y, offsetCenterY);
  // 1. 菱形 - 连接点 的line
  const rhombusToCenterLine = lineGraph(svg, x, y, x_c, y_c);
  // 2. 连接点 - F 的line
  const centerToFalseLine = lineGraph(svg, x_c, y_c, x_f, y_f);
  // 3. 连接点 - T 的line
  const centerToTrueLine = lineGraph(svg, x_c, y_c, x_t, y_t);

  // 1. 画菱形
  const rhombusE = rhombusGraph(svg, x, y);
  // 3. 画连接点
  const centerE = circleGraph(svg, x_c, y_c, 5);
  // 4. 画F
  const falseE = circleGraph(svg, x_f, y_f, 12, "F");
  falseE.click(() => {
    const isDisabled = node.nextRightNode === undefined;
    const res = operationObj.map(item => {
      if (["+", "E","S"].includes(item.label)) {
        return {
          ...item,
          attr: !isDisabled ? disabledAttr : item.attr,
          className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        };
      }
      return item;
    });
    NodeOperation(svg, x_f, y_f, 50, res, "F", node);
  });
  // 5. 画T
  const trueE = circleGraph(svg, x_t, y_t, 12, "T");
  trueE.click(() => {
    const isDisabled = node.nextLeftNode === undefined;
    const res = operationObj.map(item => {
      if (["+", "E","S"].includes(item.label)) {
        return {
          ...item,
          attr: !isDisabled ? disabledAttr : item.attr,
          className: !isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        };
      }
      return item;
    });
    NodeOperation(svg, x_t, y_t, 50, res, "T", node);
  });
  // 6. 画折线
  // lineGraph(svg, x_f, y_f, x_f + 100, y_f);
  return svg.g(rhombusToCenterLine, centerToFalseLine, centerToTrueLine, rhombusE, centerE, trueE, falseE);
};
