var pingPong = function(countTo){
  var array = [];
  for (var i = 1 ; i <= parseInt(countTo); i ++){
    array.push(i);
    for (var j = 0 ; j < array.length ; j ++){
      if (array[j] % 15 === 0){
        array.splice(j,1,"pingpong");
      }
      else if (array[j] % 3 === 0){
        array.splice(j,1,"ping");
      }
      else if (array[j] % 5 === 0){
        array.splice(j,1,"pong");
      }
    }
  }
  return array;
};

$(document).ready(function(){
  $("form#pingPong").submit(function(event){
    var userNumber = $("#userInput").val();
    var result = pingPong(userNumber);
    $(".result").text(result);
    event.preventDefault();
  })
})
