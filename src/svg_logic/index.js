import React, { Component, Fragment } from "react";
import "antd/dist/antd.css";
import "./index.css";
import RenderLogic from "./RenderLogic";
import { Button } from "antd";
import { allData } from "./mock";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      child: null,
    };
  }
  handleClick = () => {
    const { child } = this.state;
    if (child) {
      const v = child.getJson();
      console.log(v);
    }
  };
  render() {
    const data = allData;
    return (
      <Fragment>
        {/*<Button onClick={this.handleClick}>确定</Button>*/}
        <RenderLogic value={data} getChild={ctx => this.setState({ child: ctx })} />
      </Fragment>
    );
  }
}
