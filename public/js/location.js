let lat, long;

document.getElementById('autoLocation').addEventListener('click', function() {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  // Send the data to the server
  fetch('/getLocation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lat, long })
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // After sending location data, automatically call /weather
      fetch('/weather',{
        method : 'POST'
      })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));


        window.location.href = '/weather';
    })

    .catch(error => console.error('Error:', error));
}