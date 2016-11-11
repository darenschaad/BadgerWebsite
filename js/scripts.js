function createBadge(name, index, latitude, longitude, rating, imageUrl, tagsArray) {
  var newRef = firebase.database().ref('badges/').push();
  var query = firebase.database().ref('badges').orderByKey().limitToLast(1).getChild('pushId');
  console.log(query);
  var pushId = "a" + newRef.key;
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
    snapshot.forEach(function(childSnapshot) {
      var badge = childSnapshot.val();
      var image64String = badge.imageUrl;
      document.getElementById('badgeEditImage').setAttribute('src', 'data:image/png;base64,' +image64String);
      $('#badge')
      $("#badgeEditName").val(badge.name);
      $("#badgeEditComments").val(badge.comments);
      $("#badgeEditDescription").val(badge.description);
      $("#badgeEditProof").val(badge.proof);
      $("#badgeEditLatitude").val(badge.latitude);
      $("#badgeEditLongitude").val(badge.longitude);
      $("#badgeEditDewey").val(badge.index);
      $("#badgeEditCategory").val(badge.category);
      console.log(badge.name);
    })


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

  function getLastId() {
    var query = firebase.database().ref('badges').orderByKey().limitToLast(1).on("child_added", function(snapshot) {
      return (snapshot.key);
    });
  }


$(document).ready(function(){

  function setEditFormFields(badge){
    $("#badgeSearchName").val(badge.name);
  }
  $("form.search-form").submit(function(event){
    event.preventDefault();
    var searchDewey = parseFloat($("#badgeSearchDewey").val());
    searchBadge(searchDewey);


  })
  $("#searchEditButton").click(function() {
    $("#editForm").show();
  })
  var csv = "";

  $("form#badgeForm").submit(function(event){
    event.preventDefault();
    getLastId();
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
