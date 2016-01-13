const app = require("express")();
const path = require("path");
const express_static = require("express-static");

app.get("/hello", (req, res) => {
  res.send("hello world")
});

app.use(express_static(path.join(__dirname, '../public')))


app.listen(process.env.PORT || 5000);
