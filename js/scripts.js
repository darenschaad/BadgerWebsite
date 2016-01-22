var pingPong = function(countTo){
  var array = [];
  for (var i = 1 ; i <= parseInt(countTo); i ++){
    array.push(i);
    for (var j = 0 ; j < array.length ; j ++){
      if (array[j] % 15 === 0){
        array.splice(j,1,"ping-pong");
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
    var userNumber = parseInt($("#userInput").val());
    var result = pingPong(userNumber);
    var listItem = "";
    for (var i = 0; i < result.length; i++ ) {
        listItem += "<li>"  + result[i] + "</li>";
    }
      document.getElementById("itemList").innerHTML = listItem;
      $("#hidden").show();
      event.preventDefault();
  });
});
