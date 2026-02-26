const map = L.map('map', {
  zoomControl: false
}).setView([4.2105, 101.9758], 7);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let markers = [];

async function loadData() {
  try {
    const res = await fetch('/api/ktmb');
    const data = await res.json();

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    let count = 0;

    if (data.entity) {
      data.entity.forEach(train => {
        const pos = train.vehicle?.position;
        if (pos) {
          count++;

          const icon = L.divIcon({
            className: "train-icon",
            html: "🚆",
            iconSize: [20, 20]
          });

          const marker = L.marker(
            [pos.latitude, pos.longitude],
            { icon }
          ).addTo(map);

          marker.bindPopup(`
            <b>Train ID:</b> ${train.id}<br>
            <b>Speed:</b> ${pos.speed || 0} m/s
          `);

          markers.push(marker);
        }
      });
    }

    document.getElementById("trainCount").innerText =
      "Active Trains: " + count;

  } catch (err) {
    console.error(err);
  }
}

loadData();
setInterval(loadData, 10000);
