export default function genArray(max: number) {
  let array = [];
  for (let i = 0; i < max; i++) {
    array.push(randomValue());
  }
  // array = [20, 40, 60, 80, 100];
  // array = [1, 2, 3, 4, 5];
  return array;
}

export function bubbleSort(array: number[]) {
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

export function randomValue() {
  return Math.floor(Math.random() * 100);
}
