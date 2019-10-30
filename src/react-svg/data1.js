const TYPE = {
  start: 1,
  rect: 2,
  rhombus: 3,
};
const STATUS = {
  none: 0,
  true: 1,
  false: 2,
};

const floorW = 70;
const floorH = 70;

const data = [
  {
    id: 1,
    type: TYPE.start,
    prevNode: undefined,
    nextLeftNode: 2,
    nextRightNode: undefined,
    label: "开始",
    condition: "",
    x: floorW,
    y: floorH,
    status: STATUS.none,
  },
  {
    id: 2,
    type: TYPE.rhombus,
    prevNode: 1,
    nextLeftNode: 4,
    nextRightNode: 3,
    label: "逻辑1",
    condition: "京腾支付价 in api.price",
    x: floorW,
    y: floorH * 2,
    status: STATUS.true,
  },
  {
    id: 3,
    type: TYPE.rect,
    prevNode: 2,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "兜底",
    condition: "",
    x: floorW * 4,
    y: floorH * 2,
    status: STATUS.none,
  },
  {
    id: 4,
    type: TYPE.rhombus,
    prevNode: 2,
    nextLeftNode: 5,
    nextRightNode: 6,
    label: "逻辑2",
    condition: "支付价 in price.京腾",
    x: floorW,
    y: floorH * 3,
    status: STATUS.true,
  },
  {
    id: 5,
    type: TYPE.rhombus,
    prevNode: 4,
    nextLeftNode: 7,
    nextRightNode: 8,
    label: "逻辑3",
    condition: "原价 in price.京腾",
    x: floorW,
    y: floorH * 4,
    status: STATUS.true,
  },
  {
    id: 6,
    type: TYPE.rhombus,
    prevNode: 4,
    nextLeftNode: 9,
    nextRightNode: 10,
    label: "逻辑4",
    condition: "原价 in price.京腾",
    x: floorW * 7,
    y: floorH * 3,
    status: STATUS.false,
  },
  {
    id: 7,
    type: TYPE.rhombus,
    prevNode: 5,
    nextLeftNode: 11,
    nextRightNode: 12,
    label: "逻辑5",
    condition: "支付价 >= 原价",
    x: floorW,
    y: floorH * 5,
    status: STATUS.true,
  },
  {
    id: 8,
    type: TYPE.rect,
    prevNode: 5,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "显示支付价",
    condition: "",
    x: floorW * 4,
    y: floorH * 4,
    status: STATUS.false,
  },
  {
    id: 9,
    type: TYPE.rect,
    prevNode: 6,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "显示原价",
    condition: "",
    x: floorW * 7,
    y: floorH * 4,
    status: STATUS.true,
  },
  {
    id: 10,
    type: TYPE.rect,
    prevNode: 6,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "兜底",
    condition: "",
    x: floorW * 10,
    y: floorH * 3,
    status: STATUS.false,
  },
  {
    id: 11,
    type: TYPE.rect,
    prevNode: 7,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "显示支付价",
    condition: "",
    x: floorW,
    y: floorH * 6,
    status: STATUS.true,
  },
  {
    id: 12,
    type: TYPE.rect,
    prevNode: 7,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "显示支付价+原价",
    condition: "",
    x: floorW * 4,
    y: floorH * 5,
    status: STATUS.false,
  },
];

const data_o = [
  { id: 1, type: 1, nextLeftNode: 2, label: "开始", condition: "", x: 55, y: 65, x_t: 55, y_t: 65, status: 0 },
  { id: 2, type: 3, prevNode: 1, nextRightNode: 3, label: "京腾支付价", condition: "JDPrice in api.price && JTPrice > 1000 && (JXiang > 1000 && JXiang < 10000)", x: 55, y: 125, status: 1 },
  {
    id: 3,
    type: 3,
    prevNode: 2,
    nextLeftNode: 4,
    nextRightNode: 6,
    label: "xxxx",
    condition: "xxx",
    x: 255,
    y: 175,
    status: 1,
  },
  { id: 4, type: 3, prevNode: 3, nextRightNode: 5, label: "xxxx", condition: "xxx", x: 255, y: 335, status: 1 },
  { id: 5, type: 3, prevNode: 4, label: "xxxx", condition: "xxx", x: 455, y: 385, status: 1 },
  { id: 6, type: 3, prevNode: 3, label: "xxxx", condition: "xxx", x: 455, y: 225, status: 1 },
];
const data_o1 = [
  {
    id: 1,
    type: TYPE.start,
    prevNode: undefined,
    nextLeftNode: 2,
    nextRightNode: undefined,
    label: "开始",
    condition: "",
    x: 55,
    y: 65,
    x_t: 55,
    y_t: 65,
    status: STATUS.none,
  },
];

export { data, TYPE, data_o, STATUS };
