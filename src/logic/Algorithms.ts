export default function Algorithms(max: number) {
  let myArray = [];
  for (let i = 0; i < max; i++) {
    myArray.push(Math.floor(Math.random() * 255));
  }
  //console.log(myArray);
  return myArray;
}
