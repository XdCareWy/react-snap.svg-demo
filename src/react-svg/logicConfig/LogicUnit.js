import React, { Component } from "react";
import { Modal, Input, Form, Select, Divider } from "antd";

class LogicUnit extends Component {
  onOk = () => {
    const {
      onOk,
      value,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      onOk &&
        onOk({
          id: value.id,
          unitValue: values,
        });
    });
  };
  oncancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };
  render() {
    const { visible, value } = this.props;
    const { getFieldDecorator } = this.props.form;
    console.log(value);
    return (
      <Modal
        width={700}
        visible={visible}
        title="表达式配置"
        okText="确定"
        cancelText="取消"
        onOk={this.onOk}
        onCancel={this.oncancel}>
        <Form layout="vertical" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item labelAlign="right" label="左-数据获取方式">
            {getFieldDecorator("leftStyle")(
              <Select>
                <Select.Option value={1}>静态</Select.Option>
                <Select.Option value={2}>动态</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="左-类型">
            {getFieldDecorator("leftType")(
              <Select>
                <Select.Option value={1}>数值</Select.Option>
                <Select.Option value={2}>字符串</Select.Option>
                <Select.Option value={3}>布尔值</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="左-值">{getFieldDecorator("leftValue")(<Input />)}</Form.Item>
          <Divider />
          <Form.Item label="条件表达式">
            {getFieldDecorator("expression")(
              <Select>
                <Select.Option value={1}>大于</Select.Option>
                <Select.Option value={2}>小于</Select.Option>
                <Select.Option value={3}>等于</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Divider />
          <Form.Item labelAlign="right" label="右-数据获取方式">
            {getFieldDecorator("rightStyle")(
              <Select>
                <Select.Option value={1}>静态</Select.Option>
                <Select.Option value={2}>动态</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="右-类型">
            {getFieldDecorator("rightType")(
              <Select>
                <Select.Option value={1}>数值</Select.Option>
                <Select.Option value={2}>字符串</Select.Option>
                <Select.Option value={3}>布尔值</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="右-值">{getFieldDecorator("rightValue")(<Input />)}</Form.Item>
        </Form>
      </Modal>
    );
  }
}

const LogicWrap = Form.create({
  mapPropsToFields: props => {
    console.log(props.value);
    const { value: { unitValue = {} } = {} } = props;
    return {
      leftStyle: Form.createFormField({
        value: unitValue.leftStyle || 1
      }),
      leftType: Form.createFormField({
        value: unitValue.leftType || 1
      }),
      leftValue: Form.createFormField({
        value: unitValue.leftValue
      }),
      expression: Form.createFormField({
        value: unitValue.expression || 1
      }),
      rightStyle: Form.createFormField({
        value: unitValue.rightStyle || 1
      }),
      rightType: Form.createFormField({
        value: unitValue.rightType || 1
      }),
      rightValue: Form.createFormField({
        value: unitValue.rightValue
      }),
    }
  },
})(LogicUnit);
export default LogicWrap;
