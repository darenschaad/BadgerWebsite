var firebaseTagsArray = [];

var preEditTagsArray = [];
var allBadgeArrayExeptEditBadge = [];

var tagsArrayRef = firebase.database().ref('tags/').once('value').then(function(snapshot){
  snapshot.forEach(function(childSnapshot){
    var tag = childSnapshot.val();
    firebaseTagsArray.push(tag);
  })
})



function createBadge(name, index, latitude, longitude, pushId, imageUrl, description, proof, comments, category, creator, date, tags, challenges, originalIndex) {
  // this needs to be .set() with the last badge query + 1 for the id
  // var newRef = firebase.database().ref('badges/').push();
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
    challenges: challenges,
    originalIndex: originalIndex
  }
  firebase.database().ref('badges/' + pushId).set(firebaseObject);

  var createTagsArray = tags.toLowerCase().split(',');
  var newTagsArrayToFirebase = [];

  for (var i = 0; i < createTagsArray.length; i++) {
    if (!firebaseTagsArray.includes(createTagsArray[i])) {
      newTagsArrayToFirebase.push(createTagsArray[i]);
    }
  }
  for (var i = 0; i < newTagsArrayToFirebase.length; i++) {
    firebaseTagsArray.push(newTagsArrayToFirebase[i]);
  }
  firebase.database().ref('tags/').set(firebaseTagsArray);
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
    var postEditBadgeTagsArray = tags.toLowerCase().split(',');
    var postEditDeleteCheckTagsArray = [];
    // console.log(preEditTagsArray);
    // console.log(postEditBadgeTagsArray);
    for (var i = 0; i < preEditTagsArray.length; i++) {
      if (!postEditBadgeTagsArray.includes(preEditTagsArray[i])) {
        postEditDeleteCheckTagsArray.push(preEditTagsArray[i])
      }
    }
    // console.log(postEditDeleteCheckTagsArray);
    var deleteFromFirebaseTagsArray = postEditDeleteCheckTagsArray;
    for (var i = 0; i < postEditDeleteCheckTagsArray.length; i++) {
      for (var j = 0; j < allBadgeArrayExeptEditBadge.length; j++) {
        var tagCheckArray = allBadgeArrayExeptEditBadge[j].tags.toLowerCase().split(',');
        for (var k = 0; k < tagCheckArray.length; k++) {
          if(tagCheckArray[k] === postEditDeleteCheckTagsArray[i]){
            deleteFromFirebaseTagsArray.splice(i, 1);
          }
        }
      }
    }
    console.log(deleteFromFirebaseTagsArray);
    for (var i = 0; i < deleteFromFirebaseTagsArray.length; i++) {
      var index = firebaseTagsArray.indexOf(deleteFromFirebaseTagsArray[i]);
      if (index > -1) {
        firebaseTagsArray.splice(index, 1);
      }
    }
    // var ref = firebase.database().ref('badges/').orderByChild("index").equalTo(dewey).once('value').then(function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {
    //     var badge = childSnapshot.val();
    //     var badgeId = badge.pushId;
    //     var deleteRef = firebase.database().ref('badges/');
    //     deleteRef.child(badgeId).remove();
    //   })
    // })
    var postEditAddCheckTagsArray = [];
    for (var i = 0; i < postEditBadgeTagsArray.length; i++) {
      if (!preEditTagsArray.includes(postEditBadgeTagsArray[i])) {
        postEditAddCheckTagsArray.push(postEditBadgeTagsArray[i])
      }
    }
    // console.log(postEditAddCheckTagsArray);
    // console.log(allBadgeArrayExeptEditBadge);
    var addToFirebaseTagsArray = postEditAddCheckTagsArray;
    for (var i = 0; i < postEditAddCheckTagsArray.length; i++) {
      for (var j = 0; j < allBadgeArrayExeptEditBadge.length; j++) {
        var tagCheckArray = allBadgeArrayExeptEditBadge[j].tags.toLowerCase().split(',');
        for (var k = 0; k < tagCheckArray.length; k++) {
          if(tagCheckArray[k] === postEditAddCheckTagsArray[i]){
            addToFirebaseTagsArray.splice(i, 1);
          }
        }
      }
    }
    console.log(addToFirebaseTagsArray);
    for (var i = 0; i < addToFirebaseTagsArray.length; i++) {
      firebaseTagsArray.push(addToFirebaseTagsArray[i]);
    }
    firebase.database().ref('tags/').set(firebaseTagsArray);

}

function searchBadgeDelete(dewey){
  var ref = firebase.database().ref('badges/').orderByChild("index").equalTo(dewey).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var badge = childSnapshot.val();
      var firebaseImageUrl = badge.imageUrl;
      var visibleIndex = badge.index.substring(1);
      document.getElementById('badge-delete-image').setAttribute('src', firebaseImageUrl);
      $("#badge-delete-name").html("<h1>Activity: " + badge.name + "</h1>");
      $("#badge-delete-description").html("<h3>To Do: " + badge.description + "\n" + badge.comments + " \n </h3> <hr>");
      $("#badge-delete-proof").html("<h3>Proof: " + badge.proof + "</h3>");
      $('#badge-delete-image').val(firebaseImageUrl);
    })
  })
}

function badgeDelete(dewey){
  var ref = firebase.database().ref('badges/').orderByChild("index").equalTo(dewey).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var badge = childSnapshot.val();
      var badgeId = badge.pushId;
      var deleteRef = firebase.database().ref('badges/');
      deleteRef.child(badgeId).remove();
    })
  })
}

function writeTagsToFirebase() {
  return firebase.database().ref('/badges').once('value').then(function(snapshot) {
  var badges = snapshot.val();
  var allTags = [];
  for (var i = 0; i < badges.length; i++) {
    var tags = badges[i].tags.toLowerCase();
    var tagsArray = tags.split(',');
    for (var j = 0; j < tagsArray.length; j++) {
      if (!allTags.includes(tagsArray[j])) {
        allTags.push(tagsArray[j]);
      }
    }
  }
  firebase.database().ref('tags/').set(allTags);
});
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
      $("#badge-edit-id").val(badge.pushId)
      $("#badgeEditCreator").val(badge.creator);
      $("#badgeEditDate").val(badge.date);
      $("#badgeEditTags").val(badge.tags);
      $("#badgeEditChallenges").val(badge.challenges);

      preEditTagsArray = badge.tags.toLowerCase().split(",");

      var badgeArrayRef = firebase.database().ref('badges/').once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          var badgeCheck = childSnapshot.val();
          if (badgeCheck.index != badge.index) {
            allBadgeArrayExeptEditBadge.push(badgeCheck);
          }
        })
      })

    })
  })
}

function getLastId() {
  return new Promise(function(resolve, reject){
    try {
      var query = firebase.database().ref('badges').orderByKey().limitToLast(1).on("child_added", function(snapshot) {
        resolve(Number(snapshot.key) + 1);
      });
    } catch (e) {
      reject(e);
    }
  })
}
$(document).ready(function(){

  $("form#tags").submit(function(event){
    event.preventDefault();
    writeTagsToFirebase();
  });

  $("form#badge-form").submit(function(event){
    event.preventDefault();
    var name = $("#badge-name").val();
    var index = "a" + $("#badge-index").val();
    var latitude = Number($("#badge-latitude").val());
    var longitude = Number($("#badge-longitude").val());
    var imageUrl = $("#badge-imageUrl").val();
    var description = $("#badge-description").val();
    var originalIndex = Number($("#badge-index").val());
    var proof = $("#badge-proof").val();
    var comments = $("#badge-comments").val();
    var category = parseInt($("#badge-category").val());
    var creator = $("#badge-creator").val();
    var date = $("#badge-date").val();
    var tags = $("#badge-tags").val();
    var challenges = $("#badge-challenges").val();

    getLastId().then(
      function(result) {
        createBadge(name, index, latitude, longitude, result, imageUrl, description, proof, comments, category, creator, date, tags, challenges, originalIndex);
        $("#badge-name").val("");
        $("#badge-index").val("");
        $("#badge-latitude").val("");
        $("#badge-longitude").val("");
        $("#badge-imageUrl").val("");
        $("#badge-description").val("");
        $("#badge-index").val("");
        $("#badge-proof").val("");
        $("#badge-comments").val("");
        $("#badge-category").val("");
        $("#badge-creator").val("");
        $("#badge-date").val("");
        $("#badge-tags").val("");
        $("#badge-challenges").val("");
        $("#badge-form").hide();
      },function(error){
        alert('Error');
      }
    )
  });

  $("#search-form").submit(function(event){
    event.preventDefault();
    var searchDewey = "a" + $("#badgeSearchDewey").val();
    searchBadge(searchDewey);
    $("#editForm").show();
    $("#delete-form").hide();
  })

  $("#delete-search-form").submit(function(event){
    event.preventDefault();
    var searchDewey = "a" + $("#delete-search-dewey").val();
    searchBadgeDelete(searchDewey);
    $("#delete-form").show();
  })

  $("#delete-form").submit(function(event){
    event.preventDefault();
    var answer = confirm("Are you sure you want to delete this badge");
    if (answer) {
      var searchDewey = "a" + $("#delete-search-dewey").val();
      badgeDelete(searchDewey);
    }else {
      alert("Badge not deleted");
    }
  })

  $("#edit").submit(function(event){
    event.preventDefault();
    $("#search-form").show();
    $("#badge-form").hide();
    $("#delete-search-form").hide();
    $("#delete-form").hide();
  })

  $("#create").submit(function(event){
    event.preventDefault();
    $("#badge-form").show();
    $("#search-form").hide();
    $("#delete-search-form").hide();
    $("#delete-form").hide();
  })

  $("#delete").submit(function(event){
    event.preventDefault();
    $("#delete-search-form").show();
    $("#search-form").hide();
    $("#badge-form").hide();
    $("#editForm").hide();
    $("#delete-form").hide();
  })

  $('form#editForm').submit(function(event){
    event.preventDefault();
    var imageUrl = $("#edit-image-url").val();
    var name = $("#badgeEditName").val();
    var index = "a" + $("#badgeEditDewey").val();
    var latitude = Number($("#badgeEditLatitude").val());
    var longitude = Number($("#badgeEditLongitude").val());
    var pushId = Number($("#badge-edit-id").val());
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
})
