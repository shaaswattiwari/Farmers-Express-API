/* Requiring Database Model */
const reports = require("../db/modals/report");

/* Setting up the express server */
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/reports", async (req, res) => {
  var data = {
    cmdtyName: req.body.reportDetails.cmdtyName,
    cmdtyID: req.body.reportDetails.cmdtyID,
    marketID: req.body.reportDetails.marketID,
    marketName: req.body.reportDetails.marketName,
    users: [req.body.reportDetails.userID],
    priceUnit: "Kg",
    price: req.body.reportDetails.price / req.body.reportDetails.convFctr,
  }; //data object created

  try {
    const report = await reports.findOne({
      cmdtyID: data.cmdtyID,
      marketID: data.marketID,
    });

    //if there is no previous entery for the item which matches the cmdtyID and marketID, then create a new one
    if (!report) {
      const report = await new reports(data);
      const savedReport = await report.save();
      return res
        .status(201)
        .send({ status: "success", reportID: savedReport._id });
    }

    //if there is previous entery for the item which matches the cmdtyID and marketID, then
    else {
      report.users.push(...data.users);
      report.price = (data.price + report.price) / 2;
      await report.save();
      return res.status(201).send({ status: "success", reportID: report._id });
    }
  } catch (e) {
    return res.status(500).send({
      status: "failure",
      msg: "Kindly check your connection and try again",
    });
  }
});

app.get("/reports", async (req, res) => {
  try {
    const report = await reports.findById(req.query.reportID);

    //if item is present with particular reportID
    if (report) {
      return res.status(200).send(report);
    }
    //if item is not present with particular reportID
    else {
      return res.status(404).send({
        status: "failure",
        msg: "No any report found with this reportID",
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: "failure",
      msg:
        e.name == "CastError"
          ? "Kindly enter the correct ID"
          : "Kindly check your connection",
    });
  }
});

module.exports = app;
