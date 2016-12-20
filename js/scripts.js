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

  // function setEditFormFields(badge){
  //   $("#badgeSearchName").val(badge.name);
  // }
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

    // $("#delete-form").show();
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
