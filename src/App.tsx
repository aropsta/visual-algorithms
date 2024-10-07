import React from "react";

import "./styles/App.scss";

import Graph from "./Components/Graph";

// const array = Algorithms(9);
//

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Visual Algorithms</h1>
        <p>Select an algorithms and see how it sorts in real-time</p>
        <Graph></Graph>
      </header>
    </div>
  );
}

export default App;
