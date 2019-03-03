function sumOfOther(arr){
  let result = [];

  for( let i = 0 ; i < arr.length; i ++ ){
    let cutArr = arr.slice();
    cutArr.splice(i,1);
    result.push(cutArr.reduce( (sum, current) => sum + current, 0 ) );
  }

  return result;
}
