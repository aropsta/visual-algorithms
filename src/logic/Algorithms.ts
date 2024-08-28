export enum state {
  ROOT = "root",
  COMPARE = "comparitor",
  SWITCHED = "switch",
}

export interface Bar {
  value: number;
  state: state;
  color: string;
}
// export default function genArray(max: number) {
//   let array = [];
//   for (let i = 0; i < max; i++) {
//     array.push(randomValue());
//   }
//   // array = [20, 40, 60, 80, 100];
//   // array = [1, 2, 3, 4, 5];
//   return array;
// }
//
export default function genObj(max: number) {
  let array: Bar[] = [];
  for (let i = 0; i < max; i++) {
    const obj: Bar = {
      value: randomValue(),
      state: state.ROOT,
      color: "white",
    };
    array.push(obj);
  }
  return array;
}

export function bubbleSort(array: Bar[]) {
  let sorted = false;
  console.log("bubbleSort()");

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

export function randomValue() {
  return Math.floor(Math.random() * 100);
}
