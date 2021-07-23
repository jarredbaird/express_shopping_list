const express = require("express");
const app = express();
const itemsRoutes = require("./routes/items");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/items", itemsRoutes);

/* 404 */
app.use((request, response, next) => {
  return new ExpressError("Not Found", 404);
});

/* error */
app.use((err, request, response) => {
  response.status(err.status || 500);
  return response.json({
    err: err.message,
  });
});

module.exports = app;
