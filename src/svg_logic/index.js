import React, { Component, Fragment } from "react";
import "antd/dist/antd.css";
import "./index.css";
import RenderLogic from "./RenderLogic";
import { allData } from "./mock";

export default class Index extends Component {
  render() {
    const data = [];
    return (
      <Fragment>
        <RenderLogic value={data} />
      </Fragment>
    );
  }
}
