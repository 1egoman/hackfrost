function getuserlocation(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    callback(position)
  }, function(error){
    $(".percent").html("Please give us those geolocation permissions!");
  })
}
$(document).ready(function() {
  console.log( "ready!" );
  getuserlocation(function(position){
    $.ajax({
      url: '/run/' + position.coords.latitude + '/' + position.coords.longitude,
      method: "get",
    }).done(function(data) {
      if (data.error) {
        $(".percent").html(data.error);
      } else {
        $(".percent").html(
          data.label + "\n" + (data.percent*100).toFixed(2) + "%"
        );
      }
    }).fail(function() {
      $(".percent").html("We can't contact our servers. Maybe reload? IDK...");
    });
  });
});
