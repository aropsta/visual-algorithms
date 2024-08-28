import React from "react";
import "./styles/App.scss";

import Graph from "./Components/Graph";

// const array = Algorithms(9);
//

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <CircleSVG {...array}></CircleSVG> */}
        {/* <NewCirc></NewCirc> */}
        <Graph></Graph>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
