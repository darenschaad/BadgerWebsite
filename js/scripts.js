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

function createBadge(name, index, latitude, longitude, rating, imageUrl, tagsArray) {
  var newRef = firebase.database().ref('badges/').push();
  var pushId = newRef.key;
  var firebaseObject = {
    name: name,
    index: index,
    latitude: latitude,
    longitude: longitude,
    rating: rating,
    pushId: pushId,
    imageUrl: imageUrl,
    tags: {}
  }
  for (var i = 0; i < tagsArray.length; i++) {
    firebaseObject.tags[i] = tagsArray[i];
  }
  firebase.database().ref('badges/' + pushId).set(firebaseObject);
}

function searchBadge(dewey) {
  var ref = firebase.database().ref('badges/').orderByChild("index").equalTo(dewey).once('value').then(function(snapshot) {
    console.log(snapshot.val());
  })

}

function receivedText(e) {
  var lines = e.target.result;
  var newObject = JSON.parse(lines);
  console.log(newArray);
  var newArray = newObject.tags;
  for(var i = 0; i < newArray.length; i++) {
    var tagsObject = newArray[i];
    var ref = firebase.database().ref('badges/' + i + "/tags/");
      var badgeTagsObject = {};
      for(var key in tagsObject) {
        if(tagsObject.hasOwnProperty(key)) {
          console.log(tagsObject[key]);
          if(key !== "name" && tagsObject[key] !== "") {
            badgeTagsObject[key] = tagsObject[key];
          }
        }
      }
      console.log(badgeTagsObject);
      ref.set(badgeTagsObject);
  }
}

  function base64(file, callback){
    var coolFile = {};
    function readerOnload(e){
      var base64 = btoa(e.target.result);
      coolFile.base64 = base64;
      callback(coolFile)
    };

    var reader = new FileReader();
    reader.onload = readerOnload;

    // var file = file[0].files[0];
    coolFile.filetype = file.type;
    coolFile.size = file.size;
    coolFile.filename = file.name;
    reader.readAsBinaryString(file);
  }


$(document).ready(function(){

  $("form.search-form").submit(function(event){
    event.preventDefault();
    var searchDewey = parseFloat($("#badgeSearchDewey").val());
    searchBadge(searchDewey);

  })
  var csv = "";

  $("form#badgeForm").submit(function(event){
    event.preventDefault();
    var image64;
    var imageFiles = $("#imageFile");
    console.log(imageFiles);
    var imageFilesLength = imageFiles[0].files.length;


    for (var i = 0; i < imageFilesLength; i++) {
      base64(imageFiles[0].files[i], function(data){
        csv += data.base64 + "\n"

      })
    }

    // base64( $("#imageFile"), function(data){
    //   image64 = data.base64;
    //   var name = $("#badgeName").val();
    //   var index = $("#badgeIndex").val();
    //   var latitude = $("#badgeLatitude").val();
    //   var longitude = $("#badgeLongitude").val();
    //   var rating = $("#badgeRating").val();
    //
    //   createBadge(name, index, latitude, longitude, rating, image64, tagsArray);
    // })


    // var badgeId = "-KHLTOv7JMjOzRePqJLQ";
    // return firebase.database().ref('/badges/' + badgeId).once('value').then(function(snapshot) {
    //   var badgename = snapshot.val().name;
    //   console.log(badgename);
      // ...

    // });

  });
  var tagsArray = [];
  $("#formJson").submit(function(event){
    event.preventDefault();
    console.log(csv);

    var tagsJson = $("#fileJson");
    var tagsFile = tagsJson[0].files[0];
    var fr = new FileReader();
    console.log(fr);
    fr.onload = receivedText;
    fr.readAsText(tagsFile);
  })



  $("form#tagForm").submit(function(event){
    event.preventDefault();
    var newTag = $('#badgeTag').val();
    $("#tags").append('<li>' + newTag + '</li>');
    tagsArray.push(newTag);
    $('#badgeTag').val("");
    console.log(tagsArray);
  });


});
