import React, { Component, Fragment } from "react";
import "antd/dist/antd.css";
import "./index.css";
import RenderLogic from "./RenderLogic";

export default class Index extends Component {
  render() {
    return (
      <Fragment>
        <RenderLogic />
      </Fragment>
    );
  }
}
