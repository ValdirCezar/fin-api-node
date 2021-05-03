const express = require('express');

const app = express();

app.listen(3000, () => {
  console.log("Server is running on PORT: 3000");
})

app.get("/ignite", (req, res) => {
  return res.json({ message: "Ignite started!" })
})
