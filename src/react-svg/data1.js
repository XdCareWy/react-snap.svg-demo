const TYPE = {
  start: 1,
  rect: 2,
  rhombus: 3
};
const STATUS = {
  none: 0,
  true: 1,
  false: 2
};

const floorW = 70;
const floorH = 100;

const data= [
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
    status: STATUS.none
  },
  {
    id: 2,
    type: TYPE.rhombus,
    prevNode: 1,
    nextLeftNode: 4,
    nextRightNode: 3,
    label: "逻辑1",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
    x: floorW,
    y: floorH*2,
    status: STATUS.true
  },
  {
    id: 3,
    type: TYPE.rhombus,
    prevNode: 1,
    nextLeftNode: 6,
    nextRightNode: 5,
    label: "逻辑2",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
    x: floorW*4,
    y: floorH*2,
    status: STATUS.false
  },
  {
    id: 4,
    type: TYPE.rect,
    prevNode: 2,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "状态1",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
    x: floorW,
    y: floorH*3,
    status: STATUS.true
  },
  {
    id: 5,
    type: TYPE.rect,
    prevNode: 2,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "状态2",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
    x: floorW*7,
    y: floorH*2,
    status: STATUS.false
  },
  {
    id: 6,
    type: TYPE.rect,
    prevNode: 3,
    nextLeftNode: undefined,
    nextRightNode: undefined,
    label: "状态3",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
    x: floorW*4,
    y: floorH*3,
    status: STATUS.true
  }
];

export { data, TYPE };
