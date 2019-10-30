import React, {Component} from "react"

export default class Index extends Component{
  constructor(props) {
    super(props);
    this.state = {
      a: {
        b: 22
      }
    }
  }
  onClick = () => {
    this.setState({a: null})
  }

  render() {
    return <div>
      {
        this.state.a.b
      }
      <div><button onClick={this.onClick}>asds</button></div>
    </div>
  }
}
