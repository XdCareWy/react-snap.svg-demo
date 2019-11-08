/**
 *
 * @param svg
 * @param x x坐标
 * @param y y坐标
 * @param r 半径
 * @param operationObj 分布在r上的小圆圈操作
 * @param text 中心位置小圈里的文本
 * @param node 当前节点的基本信息
 * @param centerRadius 中心点的半径，默认15
 * @returns {React.ReactSVGElement | never}
 * @constructor
 */
export function NodeOperation(svg, x, y, r, operationObj, text, node, centerRadius=15) {
  const operationE = svg.select("#operationId");
  operationE && operationE.remove();
  // 外围大圈
  const circleE = svg.circle(x, y, r).attr({
    fill: "rgb(244,244,244)",
    "stroke-width": 1,
    "stroke-dasharray": 0,
    stroke: "gray",
  });
  // 中心位置的小圈
  const centerG = paintRoundText(svg, x, y, centerRadius, text);
  const deg = (2 * Math.PI) / operationObj.length;
  const oo = [];
  // 所有大圈周围的小圈
  for (let i = 0; i < operationObj.length; i++) {
    const {
      label,
      clickFn,
      attr: { circleFill, circleStroke, textFill },
    } = operationObj[i];
    const tmpE = paintCircleText(svg, x + Math.cos(deg * i) * r, y - Math.sin(deg * i) * r, 12, label);
    tmpE.select("circle").attr({
      fill: circleFill,
      stroke: circleStroke,
    });
    tmpE.select("text").attr({ fill: textFill });
    tmpE.click(() => {
      clickFn(svg, centerG, label, node, text);
    });
    oo.push(tmpE);
  }
  const g = svg.g(circleE, centerG, ...oo);
  g.attr({
    id: "operationId",
  });
  return g;
}

// 绘制大圈里中心位置的小圈
function paintRoundText(svg, x, y, r, text) {
  const textSvg = svg.text(x, y, text).attr({
    class: "text-center",
    "stroke-width": 5,
    fill: "white",
  });
  const roundSvg = svg.circle(x, y, r).attr({
    fill: "#598FE2",
    "stroke-width": 1,
    "stroke-dasharray": 0,
    stroke: "#38649E",
  });
  return svg.g(roundSvg, textSvg);
}

// 绘制大圈周围的单个小圈操作
function paintCircleText(svg, x, y, r, text, id = "") {
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
}
