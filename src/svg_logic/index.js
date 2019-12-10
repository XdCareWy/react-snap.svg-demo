import React, { Component, Fragment } from "react";
import "antd/dist/antd.css";
import "./index.css";
import RenderLogic from "./RenderLogic";
import { Button, Modal } from "antd";
import { allData } from "./mock";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      child: null,
      visible: false,
    };
  }
  handleOk = () => {};
  handleClick = () => {
    const { child } = this.state;
    if (child) {
      const v = child.getJson();
      console.log(v);
    }
  };
  render() {
    const data = allData;
    const { visible } = this.state;
    return (
      <Fragment>
        <Button onClick={() => this.setState({ visible: true })}>逻辑编辑</Button>
        <Modal
          width={900}
          visible={visible}
          onOk={this.handleClick}
          onCancel={() => this.setState({ visible: false })}>
          <RenderLogic value={data} getChild={ctx => this.setState({ child: ctx })} />
        </Modal>
      </Fragment>
    );
  }
}
