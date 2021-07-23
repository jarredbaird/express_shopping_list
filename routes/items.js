const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (request, response) => {
  response.json({ items });
});

router.post("/", (request, response, next) => {
  try {
    if (!request.body.name || !request.body.price || !+request.body.price)
      throw new ExpressError(
        "Name (a string) and price (a number) is required",
        400
      );
    const newItem = { name: request.body.name, price: +request.body.price };
    items.push(newItem);
    return response.status(201).json({ item: newItem });
  } catch (err) {
    return next(err);
  }
});

router.get("/:name", (request, response, next) => {
  try {
    const foundItems = items.reduce((accum, cur) => {
      if (cur.name === request.params.name) accum.push(cur);
      return accum;
    }, []);
    if (foundItems.length === 0) {
      throw new ExpressError("Item not found", 404);
    }
    response.json({ item: foundItems });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:name", (request, response, next) => {
  try {
    const foundItem = items.find((item) => item.name === request.params.name);
    if (!foundItem)
      throw new ExpressError("Item not found. Nothing to modify", 404);
    foundItem.name = request.body.name;
    foundItem.price = request.body.price;
    response.json({ item: foundItem });
  } catch (err) {
    next(err);
  }
});

router.delete("/:name", (request, response, next) => {
  try {
    const foundItem = items.find((item) => item.name === request.params.name);
    if (!foundItem)
      throw new ExpressError("Item not found. Nothing to delete", 404);
    items.splice(foundItem, 1);
    response.json({ message: `${request.params.name} deleted` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
