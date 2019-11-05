
// 根据数据进行渲染
import { STATUS, TYPE } from "./data1";
import { NodeOperation } from "./basicGraph/NodeOperation";

for (let node of data) {
  const { id, type, prevNode, nextLeftNode, nextRightNode, label, condition, x, y, status } = node;
  // 类型为start时，画矩形开始图
  if (type === TYPE.start) {
    const rectStart = this.paintRectText(svg, x, y, label);
    // 绑定事件
    rectStart.click(() => {
      const { x, y, width, height } = rectStart.getBBox();
      NodeOperation(svg, x + width / 2, y + height / 2, 50, operationObj, "开始", node);
    });
  }
  // 画临时文字,来获取当前文本所占的宽度和高度
  const { rectGroup, textGroup: tmp } = this.paintResponseRectText(
    svg,
    x,
    y,
    condition,
    lineWidth,
    offsetX,
    offsetY
  );
  const { width: tmpWidth, height: tmpHeight, cy: tmpCy } = tmp ? tmp.getBBox() : {};

  if (type === TYPE.rect) {
    const { textGroup, rectGroup } = this.paintResponseRectText(svg, x, y, label, 80);
    const finishTextTmpNode = textGroup.getBBox();
    if (status === STATUS.true) {
      this.paintResponseRectText(svg, x, y, label, 90, -finishTextTmpNode.width / 2, 10, 0);
    } else if (status === STATUS.false) {
      this.paintResponseRectText(svg, x, y, label, 90, 10, -finishTextTmpNode.height / 2 + 10, 0);
    } else {
      // other
    }
    rectGroup.remove();
  }
  // 类型为rhombus时，画菱形
  if (type === TYPE.rhombus) {
    if (tmpCy > y) {
      offsetY = y - tmpCy;
    } else {
      offsetY = tmpCy - y;
    }
    // 画矩形文字最终的位置
    this.paintResponseRectText(svg, x, y, condition, tmpWidth, offsetX, -tmpHeight / 2);
    // 画菱形
    this.paintLogicUnit(svg, x, y, operationObj, node, tmpWidth, tmpHeight / 2 + 20);
  }

  // 画线，从T开始往下画
  if (nextLeftNode) {
    const { x: subX, y: subY, type: subType } = data.find(item => item.id === nextLeftNode) || {};
    if (type === TYPE.start && subType === TYPE.rhombus && subX && subY) {
      this.paintLine(svg, x, y + reactHeight / 2, subX, subY - reactHeight / 2);
    } else if (type === TYPE.rhombus && subType === TYPE.rhombus) {
      const { x_t: startX, y_t: startY } = this.computeLogic(x, y, tmpWidth, tmpHeight / 2 + 20);
      this.paintLine(svg, startX, startY + reactHeight / 2, subX, subY - reactHeight / 2);
    } else if (type === TYPE.rhombus && subType === TYPE.rect) {
      const { x_t: startX, y_t: startY } = this.computeLogic(x, y, tmpWidth, tmpHeight / 2 + 20);
      this.paintLine(svg, startX, startY + reactHeight / 2, subX, subY - reactHeight / 2);
    } else {
      //  error
    }
  }
  // 画线，从F往右画
  if (nextRightNode) {
    const { x: subX, y: subY, type: subType } = data.find(item => item.id === nextRightNode) || {};
    if (type === TYPE.rhombus && subType === TYPE.rhombus) {
      const { x_f: startX, y_f: startY } = this.computeLogic(x, y, tmpWidth, tmpHeight / 2 + 20);
      this.paintLine(svg, startX + 12, startY, subX - reactWidth / 2, subY);
    } else if (type === TYPE.rhombus && subType === TYPE.rect) {
      const { x_f: startX, y_f: startY } = this.computeLogic(x, y, tmpWidth, tmpHeight / 2 + 20);
      this.paintLine(svg, startX + 12, startY, subX, subY);
    } else {
      //  error
    }
  }
  // 删除临时文字
  rectGroup && rectGroup.remove();
}
