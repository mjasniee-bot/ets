const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Production server is LIVE 🚀");
});

// 👇 WAJIB ADA NI
app.get("/api/ktmb", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb"
    );

    res.json(response.data);
  } catch (error) {
    console.error("KTMB API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch KTMB data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
