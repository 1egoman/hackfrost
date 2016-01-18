function getuserlocation(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    callback(position)
  }, function(error){
    console.log("error", error)
  })
}
$( document ).ready(function() {
    console.log( "ready!" );
    getuserlocation(function(position){
      console.log(position.coords.latitude)
      console.log(position.coords.longitude)

      $.ajax({
        url: '/run/43.158679/-76.332709',
        method: "get",
      })
      .done(function(data) {
        if (data.error) {
          $("span.percent").html(data.error)
        } else {
          $("span.percent").html(data.percent*100)
        }
      })
      .fail(function() {
        alert("Ajax failed to fetch data")
      })


    })
});
