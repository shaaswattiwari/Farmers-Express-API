const app = require("../src/app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const reports = require("../db/modals/report");

beforeAll((done) => {
  mongoose.connect(
    "mongodb+srv://m001-student:m001-mongodb-basics@taskapp.cz2wz.mongodb.net/FarmersDB-test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

test("POST /reports | To Save Data", async () => {
  await supertest(app)
    .post("/reports")
    .send({
      reportDetails: {
        userID: "user-1",
        marketID: " market-1",
        marketName: "Vashi Navi Mumbai",
        cmdtyID: "cmdty-1",
        marketType: "Mandi",
        cmdtyName: "Potato",
        priceUnit: "Pack",
        convFctr: 50,
        price: 700,
      },
    })
    .expect(201);
});

test("POST /reports | To Save Data With Same cmdtyID and MarketID", async () => {
  await supertest(app)
    .post("/reports")
    .send({
      reportDetails: {
        userID: "user-1",
        marketID: " market-1",
        marketName: "Vashi Navi Mumbai",
        cmdtyID: "cmdty-1",
        marketType: "Mandi",
        cmdtyName: "Potato",
        priceUnit: "Quintal",
        convFctr: 100,
        price: 1600,
      },
    })
    .expect(201);
});

test("POST /reports | Error Testing", async () => {
  await supertest(app)
    .post("/reports")
    .send({
      reportDetails: {
        userID: "user-1",
        marketID: " market-1",
        marketName: "Vashi Navi Mumbai",
        cmdtyID: "cmdty-1",
        marketType: "Mandi",
        cmdtyName: "Potato",
        priceUnit: "Pack",
        convFctr: "IT IS A CHARACTER HERE NOT A NUMBER", //expected a number
        price: 700,
      },
    })
    .expect(500);
});

test("GET /reports | To Fetch Report and Check Price accordingly", async () => {
  const { _id: reportID, price } = await reports.findOne({ userID: "cmdty-1" });
  expect(price).toBe(15);
  await supertest(app)
    .get("/reports")
    .query({ reportID: String(reportID) })
    .expect(200);
});

test("GET /reports | False id Error Check", async () => {
  const { _id: reportID } = await reports.findOne({ userID: "cmdty-1" });
  await supertest(app)
    .get("/reports")
    .query({ reportID: "611fd1a5d88af30015460759" }) //a false id, no any report exist with this _id
    .expect(404);
});

test("GET /reports | Invalid id Format", async () => {
  const { _id: reportID } = await reports.findOne({ cmdtyID: "cmdty-1" });
  await supertest(app)
    .get("/reports")
    .query({ reportID: "abcdefghijkl1234" }) //a non-valid _id format
    .expect(500);
});

afterAll((done) => {
  reports.deleteMany({}).then(() => done());
});
