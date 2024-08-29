import { randomValue } from "./utils";

export interface Bar {
  value: number;
  state: "root" | "compare" | "switch" | "sorted";
  color: string;
}

export default function genObj(max: number) {
  let array: Bar[] = [];
  for (let i = 0; i < max; i++) {
    array.push({
      value: randomValue(0, 100),
      state: "root",
      color: "white",
    });
  }
  return array;
}

export function bubbleSort(array: Bar[]) {
  for (let j = 0; j < array.length; j++) {
    array[j].color = "red";
    let swapped = false; //optimization: check if a swap operation has occured, if not, then value is in its correct place and can exit inner loop

    for (let i = 0; i < array.length - 1 - j; i++) {
      if (array[i].value > array[i + 1].value) {
        const temp = array[i].value;
        array[i].value = array[i + 1].value;
        array[i + 1].value = temp;
        swapped = true;
      }
    }
    //optimization to check if a swap operation has been occured. Otherwise arrway is already sorted, so we can exit
    if (!swapped) return array;
  }
  return array;
}

export function* gb(array: Bar[]) {
  for (let j = 0; j < array.length; j++) {
    let swapped = false; //optimization: check if a swap operation has occured, if not, then value is in its correct place and can exit inner loop

    for (let i = 0; i < array.length - 1 - j; i++) {
      array[i].color = "red";
      array[i + 1].color = "grey";
      yield [...array];

      if (array[i].value > array[i + 1].value) {
        const temp = array[i].value;
        array[i].value = array[i + 1].value;
        array[i + 1].value = temp;
        swapped = true;
      }
      array[j].color = "white";
      array[j + 1].color = "white";
      yield [...array];
    }
    //optimization to check if a swap operation has been occured. Otherwise arrway is already sorted, so we can exit
    array[array.length - 1 - j].state = "sorted";
    array[array.length - 1 - j].color = "green";
    if (!swapped) break;
  }
  for (let bar of array) {
    if (!bar.state) {
      bar.state = "sorted";
      bar.color = "green";
    }
  }

  yield [...array];
}

export function* t(arr: Bar[]) {
  let n = 0;

  for (; n < arr.length; n++) {
    arr[n].color = "blue";
    yield arr;
  }
}
