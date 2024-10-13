import { randomValue } from "./utils";

export interface Bar {
  id: string;
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
  MIN = "yellow",
}

//generating our data
export default function genObj(max: number): Bar[] {
  let array: Bar[] = [];
  for (let i = 0; i < max; i++) {
    array.push({
      id: `bar-${i}-${Math.random()}`,
      value: randomValue(1, 100),
      color: COLORS.CONTROL,
      fromIndex: i,
      toIndex: i,
    });
  }
  return array;
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
  //outer for loop that goes through each element of array
  for (let i = 0; i < arr.length - 1; i++) {
    //initialize some variables
    let minIndex = i;
    let swapped = false;

    //set the colour of the current value that will be getting compared against others
    arr[i].color = COLORS.PRIMARY;

    //inner loop that checks the min value for each element against all others
    for (let j = i + 1; j < arr.length; j++) {
      arr[j].color = COLORS.SECONDARY;
      yield [...arr];

      //finding the minimum value for the current elelment
      if (arr[j].value < arr[minIndex].value) {
        if (minIndex !== i) arr[minIndex].color = COLORS.CONTROL;
        minIndex = j;
        arr[minIndex].color = COLORS.MIN;
        swapped = true;
        yield [...arr];
      }
      //logic for setting the color of the 'minimum' value
      if (arr[j].color !== COLORS.MIN) arr[j].color = COLORS.CONTROL;
    }

    if (swapped) {
      //setting some properties that d3 will use to animate swap operations
      arr[i].fromIndex = i;
      arr[i].toIndex = minIndex;
      arr[minIndex].fromIndex = minIndex;
      arr[minIndex].toIndex = i;
      yield [...arr];
      const temp = arr[i].value;
      arr[i].value = arr[minIndex].value;
      arr[minIndex].value = temp;

      arr[i].toIndex = arr[i].fromIndex = i;
      arr[minIndex].toIndex = arr[minIndex].fromIndex = minIndex;

      arr[i].color = COLORS.CONTROL;
      arr[minIndex].color = COLORS.CONTROL;
    } else {
      arr[i].color = COLORS.CONTROL;
      arr[i + 1].color = COLORS.CONTROL;
      yield [...arr];
    }
  }
  for (let bar of arr) {
    bar.color = COLORS.SORTED;
  }

  yield [...arr];
}

export function insertionSortBare(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let j = i - 1;

    //Shifting values to the right by 1
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j += -1;

      arr[j + 1] = temp;
    }
    return [...arr];
  }
}
export function* insertionSort(arr: Bar[]) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let j = i - 1;

    // Highlight the current element being inserted
    arr[i].color = COLORS.PRIMARY;
    yield [...arr];

    // Find the position where temp should be inserted
    while (j >= 0 && arr[j].value > temp.value) {
      arr[j].color = COLORS.SECONDARY;
      yield [...arr];
      arr[j].color = COLORS.CONTROL;
      j--;
    }

    // Shift all elements to the right at once
    for (let k = i - 1; k > j; k--) {
      arr[k + 1] = arr[k];
      arr[k + 1].fromIndex = k;
      arr[k + 1].toIndex = k + 1;
      arr[k + 1].color = COLORS.SECONDARY;
    }

    // Place the temp element in its correct position
    arr[j + 1] = temp;
    arr[j + 1].fromIndex = i;
    arr[j + 1].toIndex = j + 1;
    yield [...arr];

    // Reset colors for this pass
    for (let k = 0; k <= i; k++) {
      arr[k].color = COLORS.CONTROL;
    }
    yield [...arr];
  }

  // Mark all elements as sorted
  for (let bar of arr) {
    bar.color = COLORS.SORTED;
  }
  yield [...arr];
}
