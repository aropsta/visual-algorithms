import React from "react";
import logo from "./logo.svg";
import "./styles/App.scss";
import Algorithms from "./logic/Algorithms";
import CircleSVG from "./Components/CircleSVG";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import NewCirc from "./Components/newCirc";
// const array = Algorithms(9);
//
const array: number[] = [11, 12, 90, 4, 44, 23, 19, 64];

const data = {
  datasets: [
    {
      label: "",
      data: [...array],
      borderColor: "black",
      backgroundColor: [
        `hsl(${Math.floor(Math.random() * 200)}, 59%, 59%)`,
        `hsl(${Math.floor(Math.random() * 200)}, 100%, 59%)`,
        `hsl(${Math.floor(Math.random() * 200)}, 100%, 59%)`,
        `hsl(${Math.floor(Math.random() * 255)}, 100%, 59%)`,
        `hsl(${Math.floor(Math.random() * 255)}, 100%, 59%)`,
        `hsl(${Math.floor(Math.random() * 255)}, 100%, 59%)`,
      ],
      hoverOffset: 40,
      borderWidth: 0,
    },
  ],
};

ChartJS.register(ArcElement, Tooltip, Legend);

function bubbleSort() {
  for (let j = 0; j < array.length; j++) {
    let swapped = false; //optimization: check if a swap operation has occured, if not, then value is in its correct place and can exit inner loop
    for (let i = 0; i < array.length - 1 - j; i++) {
      if (array[i] > array[i + 1]) {
        const temp = array[i];
        array[i] = array[i + 1];
        array[i + 1] = temp;
        swapped = true;
      }
    }
    //optimization to check if a swap operation has been occured. Otherwise arrway is already sorted, so we can exit
    if (!swapped) break;
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <CircleSVG {...array}></CircleSVG> */}
        <section>
          <NewCirc></NewCirc>
          {/* <Pie data={data} options={options}></Pie> */}
        </section>
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
