function make (a) {
  let arr = [];
  arr.push(a);

  function addToArr (){
    for(let i = 0; i < arguments.length; i ++){
    if( typeof(arguments[i]) !== 'function' ){
    arr.push(arguments[i]);
  } else {
    return arr.reduce( arguments[i] ) ;
  }
}
  return addToArr;
}

  return addToArr;
}
