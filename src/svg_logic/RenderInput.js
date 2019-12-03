import React, { Component, Fragment } from "react";
import { Form, Button, Input } from "antd";
import { TYPE } from "./constants";

class RenderInput extends Component {
  handleOk = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      value,
    } = this.props;
    validateFields((error, values) => {
      console.log(values);
      console.log(value);
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
      value,
    } = this.props;
    console.log(value);
    return (
      <div style={{ background: "#eeeeee", padding: "8px 0", margin: "0 5px" }}>
        <Form onSubmit={this.handleOk} layout="inline">
          {value.map(item => {
            if (item.type === TYPE.rhombus) {
              const { logicUnitData = [] } = item;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    border: "2px solid #dfdfdf",
                    margin: "5px 10px",
                    padding: "0 10px",
                  }}>
                  {logicUnitData.map(unit => {
                    if (unit.type === 3) {
                      const { unitValue = {}, id } = unit || {};
                      const { leftStyle, leftValue } = unitValue;
                      if (+leftStyle === 1) {
                        return (
                          <Form.Item key={id} label={leftValue.join(".")}>
                            {getFieldDecorator(`${item.id}-${id}-${leftValue.join("_")}`)(
                              <Input style={{ width: 120 }} />
                            )}
                          </Form.Item>
                        );
                      }
                    }
                  })}
                </div>
              );
            }
          })}
          <Form.Item>
            <Button style={{ marginRight: 10, marginLeft: 15 }}>重置</Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const RenderWrap = Form.create({})(RenderInput);
export default RenderWrap;
