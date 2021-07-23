process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let wine = { name: "wine", price: 20 };
let bread = { name: "bread", price: 2 };

beforeEach(() => {
  items.push(wine, bread);
});

afterEach(() => {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const response = await request(app).get("/items");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ items: [wine, bread] });
  });
});

describe("POST /items", () => {
  test("Create one new item", async () => {
    const response = await request(app)
      .post("/items")
      .send({ name: "water", price: 1 });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ item: { name: "water", price: 1 } });
  });
  test("Respond with 404 if there is no name or price in the body", async () => {
    const response = await request(app)
      .post("/items")
      .send({ action: "rock", venue: "Casbah" });
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /items/:name", () => {
  test("Get list of all items with matching name", async () => {
    const response = await request(app).get(`/items/${wine.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ item: [wine] });
  });
  test("Respond with 404 if there are no items with matching names", async () => {
    const response = await request(app).get("/items/toilet-paper");
    expect(response.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", () => {
  test("Modify a single item's name and price", async () => {
    const response = await request(app).patch(`/items/${wine.name}`);
  });
  test("Respond with 404 if there are no items with matching names", async () => {});
});

describe("DELETE /items/:name", () => {
  test("Delete an item", async () => {});
  test("Respond with 404 if there are no items with matching names", async () => {});
});
