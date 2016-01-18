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
        url: 'https://rnwmfoszsf.localtunnel.me/run/43.158679/-76.332709',
        method: "get",
      })
      .done(function(data) {
        alert(data)
      })
      .fail(function() {
        alert("Ajax failed to fetch data")
      })


    })
});
