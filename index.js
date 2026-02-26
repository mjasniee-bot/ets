const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/ktmb", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb",
      { responseType: "arraybuffer" }
    );

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(response.data)
    );

    res.json(feed);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch data"
    });

  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
