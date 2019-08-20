const TYPE = {
  react: 1,
  rhombus: 2
};

const data= [
  {
    id: 1,
    type: TYPE.rect,
    prevNode: undefined,
    nextLeftNode: 2,
    nextRightNode: 3,
    label: "开始",
    condition: "",
  },
  {
    id: 2,
    type: TYPE.rhombus,
    prevNode: 1,
    nextLeftNode: 1,
    nextRightNode: 2,
    label: "逻辑1",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
  },
  {
    id: 3,
    type: TYPE.rhombus,
    prevNode: 1,
    nextLeftNode: 1,
    nextRightNode: 2,
    label: "逻辑2",
    condition: "({d|京享值|code}==={s|n|0})&&({d|成长值|code}==={s|n|0})",
  },
];

export { data, TYPE };
