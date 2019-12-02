const TYPE = {
  start: 1, // 开始节点
  finish: 2, // 完成节点
  rhombus: 3, // 逻辑节点
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

const apiDataMOock = {
  code: 0,
  result: {
    channelPrice : {
      JDPrice: 200
    },
    jxiang: 300
  }
};

const allData = [
  {
    "id": 1,
    "type": 1,
    "nextLeftNode": 2,
    "label": "开始",
    "condition": "",
    "x": 120,
    "y": 65,
    "status": 0,
    isActivity: true
  },
  {
    "id": 2,
    "type": 3,
    "prevNode": 1,
    "nextLeftNode": 1574835179627,
    "nextRightNode": 1574835138148,
    "label": "京腾支付价",
    "status": 1,
    "condition": "channelPrice.JDPrice > 323 && jxiang > 222",
    isActivity: false,
    "logicUnitData": [
      {
        "id": 1,
        "type": 3,
        "parentId": 2,
        "tips": "channelPrice.JDPrice > 323",
        "unitValue": {
          "leftStyle": "1",
          "leftType": "1",
          "leftValue": [
            "channelPrice",
            "JDPrice",
          ],
          "expression": "1",
          "rightStyle": "2",
          "rightType": "1",
          "rightValue": "323",
        },
      },
      {
        "id": 2,
        "type": 1,
        "label": "&&",
        "parentId": undefined,
      },
      {
        "id": 3,
        "type": 3,
        "label": 3,
        "parentId": 2,
        "tips": "jxiang > 222",
        "unitValue": {
          "leftStyle": "1",
          "leftType": "1",
          "leftValue": [
            "jxiang",
          ],
          "expression": "1",
          "rightStyle": "2",
          "rightType": "1",
          "rightValue": "222",
        },
      },
    ],
  },
  {
    "id": 1574835138148,
    "type": 3,
    "prevNode": 2,
    "nextLeftNode": 1574835174931,
    "nextRightNode": 1574835177147,
    "label": "xxxx",
    "status": 2,
    "condition": "jxiang < 323 || channelPrice.TXPrice > 4343",
    isActivity: true,
    "logicUnitData": [
      {
        "id": 1,
        "type": 3,
        "parentId": 2,
        "tips": "jxiang < 323",
        "unitValue": {
          "leftStyle": "1",
          "leftType": "1",
          "leftValue": [
            "jxiang",
          ],
          "expression": "2",
          "rightStyle": "2",
          "rightType": "1",
          "rightValue": "323",
        },
      },
      {
        "id": 2,
        "type": 2,
        "label": "||",
        "parentId": undefined,
      },
      {
        "id": 3,
        "type": 3,
        "label": 3,
        "parentId": 2,
        "tips": "channelPrice.TXPrice > 4343",
        "unitValue": {
          "leftStyle": "1",
          "leftType": "1",
          "leftValue": [
            "channelPrice",
            "TXPrice",
          ],
          "expression": "1",
          "rightStyle": "2",
          "rightType": "1",
          "rightValue": "4343",
        },
      },
    ],
  },
  {
    "id": 1574835174931,
    "type": 2,
    "prevNode": 1574835138148,
    "label": "ddd",
    "condition": "请配置完成节点",
    "status": 1,
    isActivity: true
  },
  {
    "id": 1574835177147,
    "type": 2,
    "prevNode": 1574835138148,
    "label": "cxx",
    "condition": "请配置完成节点",
    "status": 2,
    isActivity: false
  },
  {
    "id": 1574835179627,
    "type": 2,
    "prevNode": 2,
    "label": "asd",
    "condition": "请配置完成节点",
    "status": 1,
    isActivity: false
  },
];


const data_o = [
  { id: 1, type: 1, nextLeftNode: 2, label: "开始", condition: "", x: 120, y: 65, status: 0 },
  { id: 2, type: 3, prevNode: 1, nextLeftNode: undefined, nextRightNode: undefined, label: "京腾支付价", status: 1 },
];
const data_o1 = [
  { id: 1, type: 1, nextLeftNode: 2, label: "开始", condition: "", x: 75, y: 65, x_t: 75, y_t: 65, status: 0 },
  {
    id: 2,
    type: 3,
    prevNode: 1,
    nextLeftNode: 3,
    nextRightNode: undefined,
    label: "京腾支付价",
    condition:
      "JDPrice in api.price && JTPrice > 1000 && (JXiang > 1000 && JXiang < 10000) || JDPrice in api.price && JTPrice > 1000 && (JXiang > 1000 && JXiang < 10000)",
    x: 75,
    y: 125,
    status: 1,
  },
];

export { data, TYPE, data_o, STATUS, allData };
