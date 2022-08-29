import React, { Component } from "react";

import Example1 from "./Example1.js";
import Example2 from "./Example2.js";

import "./style.css";

class App extends Component {
  render() {
    return (
      <>
        <Example1 />
        <Example2 />
      </>
    );
  }
}

export default App;
