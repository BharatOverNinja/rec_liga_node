const expreess = require("express");

const app = expreess();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000);
