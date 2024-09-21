const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.route("/").get((req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../frontend")));
