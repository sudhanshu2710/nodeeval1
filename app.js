const express = require("express");
const fs = require("fs");

const Addresses = JSON.parse(fs.readFileSync(`${__dirname}/db.json`));
const app = express();
const router = express.Router();
app.use(express.json());
const validator = (req, res, next) => {
  console.log(req.body);
  if (!req.body.Flat_no) {
    return res.status(400).json({
      status: "fail",
      message: "Missing flat no, it's mandatory",
    });
  }
  if (!req.body.Street) {
    return res.status(400).json({
      status: "fail",
      message: "Missing Street, it's mandatory",
    });
  }
  if (!req.body.Area) {
    return res.status(400).json({
      status: "fail",
      message: "Missing Area, it's mandatory",
    });
  }
  if (!req.body.City) {
    return res.status(400).json({
      status: "fail",
      message: "Missing City, it's mandatory",
    });
  }
  if (!req.body.State) {
    return res.status(400).json({
      status: "fail",
      message: "Missing State, it's mandatory",
    });
  }
  if (!req.body.Pincode) {
    return res.status(400).json({
      status: "fail",
      message: "Missing Pincode, it's mandatory",
    });
  }
  if ((req.body.Pincode + "").length != 6) {
    return res.status(400).json({
      status: "fail",
      message: "Pincode should be 6 digit number",
    });
  }
  next();
};
const validatPin = (req, res, next) => {
  if (req.body.Pincode && (req.body.Pincode + "").length != 6) {
    return res.status(400).json({
      status: "fail",
      message: "Pincode should be 6 digit number",
    });
  }
  next();
};
app.use("/", router);

const getAllAddresses = (req, res) => {
  // console.log(req.api_requested_by);

  res.status(200).json({
    Addresses,
  });
};
const getAddress = (req, res) => {
  const id = req.params.id * 1;
  const Address = Addresses.find((el) => el.id === id);

  //console.log("this is tour", tour);
  res.status(200).json({
    Address,
  });
};
const addAddress = (req, res) => {
  //console.log(req.body);

  const newId = Addresses[Addresses.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  Addresses.push(newUser);
  fs.writeFile(`${__dirname}/db.json`, JSON.stringify(Addresses), (err) => {
    res.status(201).json({
      Addresses,
    });
  });
};
const updateAddress = (req, res) => {
  const id = req.params.id * 1;
  const Address = Addresses.find((el) => el.id === id);

  const newUser = Object.assign(Address, req.body);

  fs.writeFile(`${__dirname}/db.json`, JSON.stringify(Addresses), (err) => {
    res.status(201).json({
      Addresses,
    });
  });
};
const deleteAddress = (req, res) => {
  const id = req.params.id * 1;

  Addresses.splice(id - 1, 1);
  fs.writeFile(`${__dirname}/db.json`, JSON.stringify(Addresses), (err) => {
    res.status(201).json({
      data: null,
    });
  });
};

router.route("/api/addresses").get(getAllAddresses).post(validator, addAddress);
router
  .route("/api/addresses/:id")
  .get(getAddress)
  .patch(validatPin, updateAddress)
  .delete(deleteAddress);
const port = 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
