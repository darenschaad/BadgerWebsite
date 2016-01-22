var pingPong = function(countTo){
  var array = [];
  for (var i = 1 ; i <= parseInt(countTo); i ++){
    array.push(i);
    for (var j = 0 ; j < array.length ; j ++){
      if (array[j] % 3 === 0){
        array.splice(j,1,"ping");
      }
      for (var k = 0 ; k <array.length ; k ++){
        if (array[k] % 5 === 0){
          array.splice(k,1,"pong");
        }
        for (var l = 0 ; l < array.length ; l ++){
          if (array[l] % 15 === 0){
            array.splice(l,1,"pingpong");
          }
        }
      }
    }
  }
  return array;
};
