function createBadge(name, index, latitude, longitude, rating, imageUrl, tags, challenges) {
  // this needs to be .set() with the last badge query + 1 for the id
  var newRef = firebase.database().ref('badges/').push();
  var pushId = getLastId() + 1;
  var firebaseObject = {
    name: name,
    index: index,
    latitude: latitude,
    longitude: longitude,
    rating: rating,
    pushId: pushId,
    imageUrl: imageUrl,
    tags: tags,
    challenges: challenges
  }
  // for (var i = 0; i < tagsArray.length; i++) {
  //   firebaseObject.tags[i] = tagsArray[i];
  // }
  firebase.database().ref('badges/' + pushId).set(firebaseObject);
}

function editBadge(name, index, latitude, longitude, imageUrl, description, proof, comments, category, pushId, creator, date, tags, challenges) {
  // var ref = firebase.database().ref('badges/').set();
  var firebaseObject = {
    name: name,
    index: index,
    latitude: latitude,
    longitude: longitude,
    pushId: pushId,
    imageUrl: imageUrl,
    description: description,
    proof: proof,
    comments: comments,
    category: category,
    creator: creator,
    date: date,
    tags: tags,
    challenges: challenges
  }
  firebase.database().ref('badges/' + pushId).set(firebaseObject);
}

function searchBadge(dewey) {
  var ref = firebase.database().ref('badges/').orderByChild("index").equalTo(dewey).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var badge = childSnapshot.val();
      var firebaseImageUrl = badge.imageUrl;
      var visibleIndex = badge.index.substring(1);
      document.getElementById('badgeEditImage').setAttribute('src', firebaseImageUrl);
      $('#edit-image-url').val(firebaseImageUrl);
      $("#badgeEditName").val(badge.name);
      $("#badgeEditComments").val(badge.comments);
      $("#badgeEditDescription").val(badge.description);
      $("#badgeEditProof").val(badge.proof);
      $("#badgeEditLatitude").val(badge.latitude);
      $("#badgeEditLongitude").val(badge.longitude);
      $("#badgeEditDewey").val(visibleIndex);
      $("#badgeEditCategory").val(badge.category);
      $("#edit-id").val(badge.pushId)
      $("#badgeEditCreator").val(badge.creator);
      $("#badgeEditDate").val(badge.date);
      $("#badgeEditTags").val(badge.tags);
      $("#badgeEditChallenges").val(badge.challenges);
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

function uploadImages(imageArray) {

  for (var i = 0; i < imageArray.length; i++) {
    firebase.database().ref('images/' + i + '/imageUrl').set(imageArray[i]);
  }
}

$(document).ready(function(){

  function setEditFormFields(badge){
    $("#badgeSearchName").val(badge.name);
  }
  $("form.search-form").submit(function(event){
    event.preventDefault();
    var searchDewey = "a" + $("#badgeSearchDewey").val();
    searchBadge(searchDewey);


  })
  $("#searchEditButton").click(function() {
    $("#editForm").show();
  })
  var csv = [];

  $("form#badgeForm").submit(function(event){
    event.preventDefault();
    var image64;
    var imageFiles = $("#imageFile");
    console.log(imageFiles);
    var imageFilesLength = imageFiles[0].files.length;


    for (var i = 0; i < imageFilesLength; i++) {
      base64(imageFiles[0].files[i], function(data){
        csv.push(data.base64);
        console.log(i);

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
    uploadImages(csv);
    var tagsJson = $("#fileJson");
    var tagsFile = tagsJson[0].files[0];
    var fr = new FileReader();

    fr.onload = receivedText;
    fr.readAsText(tagsFile);
  })

  $('form#editForm').submit(function(event){
    event.preventDefault();
    var imageUrl = $("#edit-image-url").val();
    var name = $("#badgeEditName").val();
    var index = "a" + $("#badgeEditDewey").val();
    var latitude = Number($("#badgeLatitude").val());
    var longitude = Number($("#badgeLongitude").val());
    var pushId = parseInt($("#edit-id").val());
    var proof = $("#badgeEditProof").val();
    var description = $("#badgeEditDescription").val();
    var comments = $("#badgeEditComments").val();
    var category = parseInt($("#badgeEditCategory").val());
    var creator = $("#badgeEditCreator").val();
    var date = $("#badgeEditDate").val();
    var tags = $("#badgeEditTags").val();
    var challenges = $("#badgeEditChallenges").val();
    editBadge(name, index, latitude, longitude, imageUrl, description, proof, comments, category, pushId, creator, date, tags, challenges);
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
