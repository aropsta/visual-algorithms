import { randomValue } from "./utils";

export interface Bar {
  value: number;
  color: string;
  fromIndex?: number;
  toIndex?: number;
}

export enum COLORS {
  PRIMARY = "blue",
  SECONDARY = "grey",
  CONTROL = "white",
  SORTED = "green",
  NOCHANGE = "yellow",
}

//generating our data
export default function genObj(max: number): Bar[] {
  let array: Bar[] = [];
  for (let i = 0; i < max; i++) {
    array.push({
      value: randomValue(0, 100),
      color: "white",
    });
  }
  return array;
}

export function bubbleSortBare(array: Bar[]) {
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

export function* bubbleSort(arr: Bar[]) {
  for (let j = 0; j < arr.length; j++) {
    let swapped = false; //optimization: check if a swap operation has occured, if not, then value is in its correct place and can exit inner loop

    for (let i = 0; i < arr.length - 1 - j; i++) {
      arr[i].color = COLORS.PRIMARY;
      arr[i + 1].color = COLORS.SECONDARY;
      yield [...arr];

      if (arr[i].value > arr[i + 1].value) {
        //used by d3 to render animation
        arr[i].fromIndex = i;
        arr[i].toIndex = i + 1;
        arr[i + 1].fromIndex = i + 1;
        arr[i + 1].toIndex = i;

        //swapping values
        const temp = arr[i + 1];
        arr[i + 1] = arr[i];
        arr[i] = temp;

        yield [...arr];

        arr.forEach((bar, i) => {
          bar.fromIndex = bar.toIndex = i;
        });

        arr[i].color = COLORS.CONTROL;
        swapped = true;
      } else {
        arr[i].color = COLORS.NOCHANGE;
        arr[i + 1].color = COLORS.NOCHANGE;
        yield [...arr];
      }

      //reset colors and yielding array. Acts a a break for showing progress
      arr[i].color = COLORS.CONTROL;
      arr[i + 1].color = COLORS.CONTROL;
      yield [...arr];
    }
    //optimization to check if a swap operation has been occured. Otherwise arrway is already sorted, so we can exit
    arr[arr.length - 1 - j].color = COLORS.SORTED;
    yield [...arr];
    if (!swapped) break;
  }
  for (let bar of arr) {
    bar.color = COLORS.SORTED;
  }

  yield [...arr];
}
