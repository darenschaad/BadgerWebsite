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
  })

  $("#edit").submit(function(event){
    event.preventDefault();
    $("#search-form").show();
    $("#badge-form").hide();
    $("#delete-search-form").hide();
  })

  $("#create").submit(function(event){
    event.preventDefault();
    $("#badge-form").show();
    $("#search-form").hide();
    $("#delete-search-form").hide();
  })

  $("#delete").submit(function(event){
    event.preventDefault();
    $("#delete-search-form").show();
    $("#search-form").hide();
    $("#badge-form").hide();
  })

  $("#edit").submit(function(event){
    event.preventDefault();
  })

  $("#searchEditButton").click(function() {
    $("#editForm").show();
  })

  $("form#badge-form").submit(function(event){
    event.preventDefault();

      var name = $("#badge-name").val();
      var index = "a" + $("#badge-index").val();
      var latitude = Number($("#badge-latitude").val());
      var longitude = Number($("#badge-longitude").val());
      var imageUrl = $("#badge-imageUrl").val();
      var description = $("#badge-description").val();
      var originalIndex = Number($("#badge-index").val())
      var proof = $("#badge-proof").val();
      var comments = $("#badge-comments").val();
      var category = parseInt($("#badge-category").val());
      var creator = $("#badge-creator").val();
      var date = $("#badge-date").val();
      var tags = $("#badge-tags").val();
      var challenges = $("#badge-challenges").val();
      // var pushId = lastId + 1;
      // var lastId = getLastId();
      // console.log(pushId);
      // console.log("test" + getLastId());
      getLastId().then(
        function(result) {
          console.log(typeof result);
          createBadge(name, index, latitude, longitude, result, imageUrl, description, proof, comments, category, creator, date, tags, challenges, originalIndex);
        },function(error){
          alert('Error');
        }
      )


  });
  // var tagsArray = [];
  // $("#formJson").submit(function(event){
  //   event.preventDefault();
  //   console.log(csv);
  //   uploadImages(csv);
  //   var tagsJson = $("#fileJson");
  //   var tagsFile = tagsJson[0].files[0];
  //   var fr = new FileReader();
  //
  //   fr.onload = receivedText;
  //   fr.readAsText(tagsFile);
  // })

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



  // $("form#tagForm").submit(function(event){
  //   event.preventDefault();
  //   var newTag = $('#badgeTag').val();
  //   $("#tags").append('<li>' + newTag + '</li>');
  //   tagsArray.push(newTag);
  //   $('#badgeTag').val("");
  //   console.log(tagsArray);
  // });


})
