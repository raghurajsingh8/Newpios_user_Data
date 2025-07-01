function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(4);
      const lon = pos.coords.longitude.toFixed(4);
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lon;

      // Dummy data based on rough Indian zones
      let sunlight = 5.5;
      let rate = 6;
      if (lat > 25) sunlight = 6.5;
      else if (lat < 20) sunlight = 5.0;

      document.getElementById("sunlight").value = sunlight;
      document.getElementById("rate").value = rate;
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

function goToResult() {
  const bill = +document.getElementById("bill").value;
  const sunlight = +document.getElementById("sunlight").value;
  const rate = +document.getElementById("rate").value;

  if (!bill || !sunlight || !rate) {
    alert("Please fill all values.");
    return;
  }

  // Save data in localStorage
  localStorage.setItem("bill", bill);
  localStorage.setItem("sunlight", sunlight);
  localStorage.setItem("rate", rate);

  window.location.href = "../page4/index.html";
}
