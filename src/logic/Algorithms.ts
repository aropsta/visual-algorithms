export default function Algorithms(max: number) {
  var myArray = [];
  for (let i = 0; i < max; i++) {
    myArray.push(Math.floor(Math.random() * 20));
  }
  //console.log(myArray);
  return myArray;
}
