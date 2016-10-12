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

function base64(file, callback){
  console.log("Hello");
  console.log(file);
  var coolFile = {};
  function readerOnload(e){
    var base64 = btoa(e.target.result);
    coolFile.base64 = base64;
    callback(coolFile)
  };

  var reader = new FileReader();
  reader.onload = readerOnload;

  var file = file[0].files[0];
  console.log(file);
  coolFile.filetype = file.type;
  coolFile.size = file.size;
  coolFile.filename = file.name;
  reader.readAsBinaryString(file);
}

$(document).ready(function(){
  $("form#pingPong").submit(function(event){
    event.preventDefault();

    base64( $("#file"), function(data){
      console.log(data.base64)
    })
    var badgeId = "-KHLTOv7JMjOzRePqJLQ";
    return firebase.database().ref('/badges/' + badgeId).once('value').then(function(snapshot) {
      var badgename = snapshot.val().name;
      console.log(badgename);
      // ...

    });
      // function createBadge(userId, name, email, imageUrl) {
      //   firebase.database().ref('users/' + userId).set({
      //   username: name,
      //   email: email,
      //   profile_picture : imageUrl
      //   });
      // }




  });
});
