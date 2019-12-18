/**
 * 逻辑可视化 - 基础图形 - 开始图形
 * @param svg
 * @param x 开始x坐标
 * @param y 开始x坐标
 * @param text 开始文案
 * @param color 开始外边框颜色
 * @returns {React.ReactSVGElement | never}
 */
export const paintRectText = (svg, x, y, text, color) => {
  const { width, height } = getTextNodeBox(svg, text);
  const textE = textGraph(svg, x + width / 2, y + height / 2 + 8, text);
  const rectE = rectGraph(svg, x, y, width * 2, height + 8, 0, 5, "rgb(240,240,240)", color);
  return svg.g(rectE, textE);
};

/**
 * 逻辑可视化 - 基础图形 - 菱形
 * @param svg
 * @param x 菱形x坐标，默认 0
 * @param y 菱形y坐标，默认 0
 * @param width 菱形的宽度，默认 60
 * @param height 菱形的高度， 默认 20
 * @param strokeColor 菱形外围的颜色，默认 gray
 * @returns 菱形图形
 */
export const rhombusGraph = (svg, x = 0, y = 0, strokeColor = "gray", width = 60, height = 20) => {
  return svg
    .polyline([x - width / 2, y, x, y - height / 2, x + width / 2, y, x, y + height / 2, x - width / 2, y])
    .attr({
      fill: "#FEFEFE",
      stroke: strokeColor,
      "stroke-width": 2,
      "stroke-dasharray": 0,
    });
};

/**
 * 逻辑可视化 - 基础图形 - 线段
 * @param svg
 * @param fromX 线段开始点x坐标
 * @param fromY 线段开始点y坐标
 * @param toX 线段结束点x坐标
 * @param toY 线段结束点y坐标
 * @param color 线段的颜色，默认 "#8F8F8F"
 * @returns 线段
 */
export const lineGraph = (svg, fromX, fromY, toX, toY, color = "#8F8F8F") => {
  return svg.line(fromX, fromY, toX, toY).attr({
    fill: "transparent",
    stroke: color,
    "stroke-width": 2,
    "stroke-dasharray": 0,
  });
};

/**
 * 逻辑可视化 - 基础图形 - 圆（可带文本）
 * @param svg
 * @param x 圆心x坐标
 * @param y 圆心y坐标
 * @param radius 圆的半径
 * @param text 圆内的文本
 * @param color 圆内的颜色，默认 gray
 * @returns {React.ReactSVGElement | never}
 */
export const circleGraph = (svg, x, y, radius, text, color = "gray") => {
  const textElement = svg.text(x, y, text).attr({
    class: "text-center",
  });
  const roundElement = svg.circle(x, y, radius).attr({
    fill: "rgb(215,216,217)",
    "stroke-width": 1,
    "stroke-dasharray": 0,
    stroke: color,
  });
  const circleGroup = svg.g(roundElement, textElement);
  if (text) {
    circleGroup.hover(
      function() {
        circleGroup.select("circle").animate({ r: radius + 2 }, 100);
      },
      function() {
        circleGroup.select("circle").animate({ r: radius }, 100);
      }
    );
  }
  return circleGroup;
};

/**
 * 逻辑可视化 - 基础图形 - 带箭头的直线
 * @param svg
 * @param fromX 线段的起点x坐标， 默认 0
 * @param fromY 线段的起点y坐标， 默认 0
 * @param toX 线段的终点x坐标， 默认 10
 * @param toY 线段的终点y坐标， 默认 20
 * @param color 线段及箭头外围的颜色，默认 "#8F8F8F"
 * @returns 带箭头的线段图形
 */
export const arrowLine = (svg, fromX = 0, fromY = 0, toX = 10, toY = 20, color = "#8F8F8F") => {
  const arrowPath = svg.path("M0,0 L0,4 L3,2 L0,0").attr({
    fill: color,
  });
  const markerEnd = arrowPath.marker(0, 0, 12, 12, 3, 2);
  return svg.line(fromX, fromY, toX, toY).attr({
    fill: "transparent",
    stroke: color,
    "stroke-width": 2,
    "stroke-dasharray": 0,
    "marker-end": markerEnd,
  });
};

/**
 * 逻辑可视化 - 基础图形 - 带箭头的折线
 * @param svg
 * @param fromX 折线的起点x坐标
 * @param fromY 折线的起点y坐标
 * @param toX 折线的终点x坐标
 * @param toY 折线的终点y坐标
 * @param color 折线的颜色，默认#8F8F8F
 * @returns {*}
 */
export const brokenLineGraph = (svg, fromX, fromY, toX, toY, color = "#8F8F8F") => {
  const arrowPath = svg.path("M0,0 L0,4 L3,2 L0,0").attr({
    fill: color,
  });
  const markerEnd = arrowPath.marker(0, 0, 12, 12, 3, 2);
  const brokenX = toX; // 折点的x坐标
  const brokenY = fromY; // 折点的y坐标
  return svg.path(`M${fromX},${fromY} L${brokenX},${brokenY} L${toX},${toY}`).attr({
    stroke: color,
    strokeWidth: 2,
    fill: "transparent",
    "marker-end": markerEnd,
  });
};

/**
 * 逻辑可视化 - 基本图形 - 文本图形
 * @param svg
 * @param x 文本的x坐标
 * @param y 文本的y坐标
 * @param text 文本
 * @param fill 文本填充颜色
 * @returns 文本图形
 */
export const textGraph = (svg, x, y, text, fill) => {
  if (!text) throw new Error("text is not exist");
  return svg.text(x, y, text).attr({ "font-size": 12, fill: fill });
};

/**
 * 逻辑可视化 - 基本图形 - 矩形图形
 * @param svg
 * @param x 矩形的x坐标
 * @param y 矩形的y坐标
 * @param width 矩形的宽度
 * @param height 矩形的高度
 * @param dasharray 矩形外围线的间隔（实线/虚线），默认 3
 * @param borderRadius 矩形外围线的圆角，默认 10
 * @param fill 矩形内颜色，默认 transparent（透明）
 * @param stroke 矩形外边框颜色，默认 #8F8F8F
 * @returns 矩形图形
 */
export const rectGraph = (
  svg,
  x,
  y,
  width,
  height,
  dasharray = 3,
  borderRadius = 10,
  fill = "transparent",
  stroke = "#8F8F8F"
) => {
  return svg.rect(x, y, width, height, 0, 0).attr({
    fill: fill,
    stroke: stroke,
    "stroke-width": 1,
    "stroke-dasharray": dasharray,
    rx: borderRadius,
    ry: borderRadius,
  });
};

/**
 * 逻辑可视化 - 基本图形 - 可伸缩矩形文本框
 * @param svg
 * @param x 矩形文本框x坐标
 * @param y 矩形文本框y坐标
 * @param text 文本
 * @param lineMaxWidth 矩形的最大宽度
 * @param dasharray 矩形外围虚线程度
 * @param dasharray 矩形外围虚线程度
 * @param fill 矩形内颜色，默认 transparent（透明）
 * @param stroke 矩形外边框颜色
 * @returns {{rectGroup: React.ReactSVGElement | never, textGroup: React.ReactSVGElement | never}}
 */
export const responseRectText = (
  svg,
  x,
  y,
  text = "请配置该逻辑单元",
  lineMaxWidth = 100,
  dasharray = 3,
  fill = "transparent",
  stroke
) => {
  if (!text) throw new Error("text is not exist");
  const words = text.split("").reverse();
  let line = [];
  let textX = x + 50; // 文本实际绘制的x坐标
  let textY = y; // 文本实际绘制的y坐标
  let lineHeightSpace = 0; // 单行文本的高度
  let word = words.pop();
  const allElements = [];
  while (word) {
    line.push(word);
    const { width: lineWidth, height: lineHeight } = getTextNodeBox(svg, line.join(""));
    lineHeightSpace = lineHeight;
    if (lineWidth > lineMaxWidth) {
      line.pop();
      // 绘制当前的文字
      const currentText = textGraph(svg, textX, textY, line.join(""));
      allElements.push(currentText);
      // 重置到下一行
      line = [word];
      // 设置下一行的y坐标
      textY = textY + lineHeightSpace;
    }
    word = words.pop();
  }
  // 绘制剩下的文字
  const lastRealText = textGraph(svg, textX, textY, line.join(""));
  allElements.push(lastRealText);
  // 将所有text放到一个组里
  const textGroup = svg.g(...allElements);
  // 根据文本字的宽高来确定外围方框的位置
  const { x: gx, y: gy, width, height } = textGroup.getBBox();
  const [rectX, rectY, rectWidth, rectHeight] = [gx - 10, gy - 10, width + 20, height + 20];
  const rectGroup = rectGraph(svg, rectX, rectY, rectWidth, rectHeight, dasharray, 10, fill, stroke);
  return {
    rectGroup: svg.g(rectGroup, textGroup),
    textGroup: textGroup,
  };
};

/**
 * 逻辑可视化 - 计算单元 - 矩形文本框的宽度和高度
 * @param svg
 * @param x 矩形文本框x坐标
 * @param y 矩形文本框y坐标
 * @param text 文本
 * @param lineMaxWidth  矩形的最大宽度
 * @param dasharray 矩形外围虚线程度
 * @returns {{width: number, height: number}}
 */
export const getResponseRectTextBox = (svg, x, y, text, lineMaxWidth = 100, dasharray = 3) => {
  let width, height;
  const { rectGroup } = responseRectText(svg, x, y, text, lineMaxWidth, dasharray);
  width = rectGroup.getBBox().width;
  height = rectGroup.getBBox().height;
  rectGroup.remove();
  return {
    width,
    height,
  };
};

/**
 * 逻辑可视化 - 计算单元 - 计算文本的宽高
 * @param svg
 * @param text 文本
 * @returns {{width: number, height: number}} 返回文本的宽、高
 */
export const getTextNodeBox = (svg, text) => {
  if (!text) throw new Error("text is not exist");
  let textWidth, textHeight;
  const textNode = svg.text(0, 0, text).attr({ "font-size": 12 });
  textWidth = textNode.getBBox().width;
  textHeight = textNode.getBBox().height;
  textNode.remove();
  return {
    width: textWidth,
    height: textHeight,
  };
};