// 节点的类型; 1 - 开始节点, 2 - 完成节点, 3 - 逻辑节点
export const TYPE = { start: 1, finish: 2, rhombus: 3 };
// 节点的状态; 0 - 状态为完成的节点,  1- 状态为true的节点, 2 - 状态为false的节点
export const STATUS = { none: 0, true: 1, false: 2 };
// 激活时的颜色
export const ACTIVITY_COLOR = "red";
// 逻辑类型
export const LOGIC_TYPE = { and: 1, or: 2, none: 3 };

export const startPoint = { x: 120, y: 47 };

export const disabledAttr = { circleStroke: "#d9d9d9", circleFill: "#f5f5f5", textFill: "rgba(0,0,0,0.25)" };
export const configAttr = { circleStroke: "#38649E", circleFill: "#E6F1FD", textFill: "#336CA8" };
export const addAttr = { circleStroke: "#38649E", circleFill: "#E6F1FD", textFill: "#336CA8" };
export const finishAttr = { circleStroke: "#38649E", circleFill: "#E6F1FD", textFill: "#336CA8" };
export const deleteAttr = { circleStroke: "#920000", circleFill: "#FCDBE0", textFill: "#C71723" };
export const cancelAttr = { circleStroke: "red", circleFill: "#FCDBE0", textFill: "#C71723" };

export const channelOptions = [{ id: 1, value: 1, label: "动态" }, { id: 2, value: 2, label: "静态" }];
export const valueTypeOptions = [
  { id: 1, value: 1, label: "数值" },
  { id: 2, value: 2, label: "字符串" },
  { id: 3, value: 3, label: "布尔值" },
];
export const symbolMap = { 1: ">", 2: "<", 3: "==" };
export const symbolTypeOptions = [
  { id: 1, value: 1, label: "大于" },
  { id: 2, value: 2, label: "小于" },
  { id: 3, value: 3, label: "等于" },
];
