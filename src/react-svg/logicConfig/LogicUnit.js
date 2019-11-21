import React, { Component, Fragment } from "react";
import { Modal, Input, Form, Select, Divider, Cascader } from "antd";

const apis = [
  { id: 1, value: 1, label: "价格接口" },
];
// 模拟请求回来的数据
const dynamicDataStructure = [
  {
    value: "channelPrice",
    label: "渠道",
    children: [
      { value: "JDPrice", label: "京东价" },
      { value: "TXPrice", label: "腾讯价" },
    ],
  },
  {
    value: "jxiang",
    label: "京享值",
  },
];

const valueChannel = [{ id: 1, value: 1, label: "动态" }, { id: 2, value: 2, label: "静态" }];
const valueMap = {
  1: "number",
  2: "string",
  3: "boolean",
};
const valueType = [
  { id: 1, value: 1, label: "数值" },
  { id: 2, value: 2, label: "字符串" },
  { id: 3, value: 3, label: "布尔值" },
];
const symbolMap = {
  1: ">",
  2: "<",
  3: "==",
};
const symbolType = [
  { id: 1, value: 1, label: "大于" },
  { id: 2, value: 2, label: "小于" },
  { id: 3, value: 3, label: "等于" },
];

class LogicUnit extends Component {
  onOk = () => {
    const {
      onOk,
      value,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      console.log(values);
      let res = "";
      const {leftStyle, expression, leftValue, rightStyle, rightValue} = values;
      if(leftStyle === "1" && rightStyle === "1") {
        res = `${leftValue.join(".")} ${symbolMap[expression]} ${rightValue.join(".")}`
      }else if(leftStyle === "1" && rightStyle === "2") {
        res = `${leftValue.join(".")} ${symbolMap[expression]} ${rightValue}`
      }else if(leftStyle === "2" && rightStyle === "1") {
        res = `${leftValue} ${symbolMap[expression]} ${rightValue.join(".")}`
      }else {
        res = `${leftValue} ${symbolMap[expression]} ${rightValue}`
      }
      onOk &&
      onOk({
        id: value.id,
        unitValue: values,
        tips: res
      });
    });
  };
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  render() {
    const { visible, value } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const channelValueLeft = getFieldValue("leftStyle");
    const channelValueRight = getFieldValue("rightStyle");
    console.log(channelValueLeft);
    return (
      <Modal
        width={700}
        visible={visible}
        title="表达式配置"
        okText="确定"
        cancelText="取消"
        onOk={this.onOk}
        onCancel={this.onCancel}>
        <Form layout="vertical" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item labelAlign="right" label="左-数据获取方式">
            {getFieldDecorator("leftStyle")(
              <Select>
                {
                  valueChannel.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
                }
              </Select>,
            )}
          </Form.Item>
          {
            channelValueLeft === "2" &&
            <Fragment>
              <Form.Item label="左-类型">
                {getFieldDecorator("leftType")(
                  <Select>
                    {
                      valueType.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="左-值">{getFieldDecorator("leftValue")(<Input/>)}</Form.Item>
            </Fragment>
          }
          {
            channelValueLeft === "1" &&
            <Fragment>
              <Form.Item label="左-接口">
                {getFieldDecorator("leftType")(
                  <Select>
                    {
                      apis.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="左-字段">
                {getFieldDecorator("leftValue")(
                  <Cascader options={dynamicDataStructure}/>,
                )}
              </Form.Item>
            </Fragment>
          }
          <Divider/>
          <Form.Item label="条件表达式">
            {getFieldDecorator("expression")(
              <Select>
                {
                  symbolType.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
                }
              </Select>,
            )}
          </Form.Item>
          <Divider/><Form.Item labelAlign="right" label="右-数据获取方式">
          {getFieldDecorator("rightStyle")(
            <Select>
              {
                valueChannel.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
              }
            </Select>,
          )}
        </Form.Item>
          {
            channelValueRight === "2" &&
            <Fragment>
              <Form.Item label="右-类型">
                {getFieldDecorator("rightType")(
                  <Select>
                    {
                      valueType.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="右-值">{getFieldDecorator("rightValue")(<Input/>)}</Form.Item>
            </Fragment>
          }
          {
            channelValueRight === "1" &&
            <Fragment>
              <Form.Item label="左-接口">
                {getFieldDecorator("rightType")(
                  <Select>
                    {
                      apis.map(item => <Select.Option key={item.value}>{item.label}</Select.Option>)
                    }
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="左-字段">
                {getFieldDecorator("rightValue")(
                  <Cascader options={dynamicDataStructure}/>,
                )}
              </Form.Item>
            </Fragment>
          }
        </Form>
      </Modal>
    );
  }
}

const LogicWrap = Form.create({
  mapPropsToFields: props => {
    const { value: { unitValue = {} } = {} } = props;
    return {
      leftStyle: Form.createFormField({
        value: unitValue.leftStyle || "1",
      }),
      leftType: Form.createFormField({
        value: unitValue.leftType || "1",
      }),
      leftValue: Form.createFormField({
        value: unitValue.leftValue,
      }),
      expression: Form.createFormField({
        value: unitValue.expression || "1",
      }),
      rightStyle: Form.createFormField({
        value: unitValue.rightStyle || "1",
      }),
      rightType: Form.createFormField({
        value: unitValue.rightType || "1",
      }),
      rightValue: Form.createFormField({
        value: unitValue.rightValue,
      }),
    };
  },
})(LogicUnit);
export default LogicWrap;
