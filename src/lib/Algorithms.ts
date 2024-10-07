import delay from "delay";
import { randomValue } from "./utils";

export interface Bar {
  value: number;
  color: string;
  fromIndex?: number;
  toIndex?: number;
}

export enum COLORS {
  PRIMARY = "mediumblue",
  SECONDARY = "silver",
  CONTROL = "white",
  SORTED = "springgreen",
  NOCHANGE = "black",
}

//generating our data
export default function genObj(max: number): Bar[] {
  let array: Bar[] = [];
  for (let i = 0; i < max; i++) {
    array.push({
      value: randomValue(1, 100),
      color: COLORS.CONTROL,
    });
  }
  // return array;
  return [
    {
      value: 56,
      color: COLORS.CONTROL,
    },
    {
      value: 43,
      color: COLORS.CONTROL,
    },
    {
      value: 44,
      color: COLORS.CONTROL,
    },
    {
      value: 29,
      color: COLORS.CONTROL,
    },
    {
      value: 38,
      color: COLORS.CONTROL,
    },
    {
      value: 26,
      color: COLORS.CONTROL,
    },
  ];
  // return [
  //   {
  //     value: 1,
  //     color: "black",
  //   },
  //   {
  //     value: 58,
  //     color: "black",
  //   },
  //   {
  //     value: 26,
  //     color: "black",
  //   },
  //   {
  //     value: 100,
  //     color: "black",
  //   },
  //   {
  //     value: 2,
  //     color: "black",
  //   },
  //   {
  //     value: 5,
  //     color: "black",
  //   },
  //   {
  //     value: 11,
  //     color: "black",
  //   },
  // ];
}

export function bubbleSortBare(array: Bar[]) {
  for (let j = 0; j < array.length; j++) {
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

export function* selectionSort(arr: Bar[]) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    let swapped = false;

    arr[i].color = COLORS.PRIMARY;
    for (let j = i + 1; j < arr.length; j++) {
      arr[j].color = COLORS.SECONDARY;
      yield [...arr];

      if (arr[j].value < arr[minIndex].value) {
        minIndex = j;
        swapped = true;
      }
      arr[j].color = COLORS.CONTROL;
    }

    if (swapped) {
      arr[i].fromIndex = i;
      arr[i].toIndex = minIndex;
      arr[minIndex].fromIndex = minIndex;
      arr[minIndex].toIndex = i;
      yield [...arr];
      const temp = arr[i].value;
      arr[i].value = arr[minIndex].value;
      arr[minIndex].value = temp;

      arr.forEach((bar, i) => {
        bar.fromIndex = bar.toIndex = i;
      });

      arr[i].color = COLORS.CONTROL;
      arr[minIndex].color = COLORS.CONTROL;
      yield [...arr];
    } else {
      arr[i].color = COLORS.CONTROL;
      arr[i + 1].color = COLORS.CONTROL;
    }
  }
  for (let bar of arr) {
    bar.color = COLORS.SORTED;
  }

  yield [...arr];
}
