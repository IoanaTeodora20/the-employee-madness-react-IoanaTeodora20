require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const EmployeeModel = require("./db/employee.model");
const Equipment = require("./db/equipmentSchema");
const favColorModel = require("./db/favColorModel");
const positions = require("../server/populate/positions.json");
const levels = require("../server/populate/levels.json");
const Company = require("./db/companySchema");
const { ObjectID, ObjectId } = require("bson");
const { json } = require("express");
const PORT = 8080;
const objectId = require("mongodb").ObjectId;

if (!process.env.MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    //optionsuccessStatus solution for cors policy
  })
);

let updatedPresence;
app.use("/api/employees/:id", async (req, res, next) => {
  let employee = null;

  try {
    employee = await EmployeeModel.findById(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (!employee) {
    return res.status(404).end("Employee not found");
  }

  req.employee = employee;
  next();
});

app.get("/api/employees/", async (req, res) => {
  const addPresence = await EmployeeModel.updateMany({
    $set: { presence: false },
  });

  const employeeEquipment = await EmployeeModel.find({
    "employees.equipment": Equipment,
  });
  const employees = await EmployeeModel.find({});
  return res.json(employees);
});

app.get("/api/employees/:id", (req, res) => {
  return res.json(req.employee);
});

app.post("/api/inputName", async (req, res) => {
  const nameInput = req.body.inputName;
  const employeeList = await EmployeeModel.find({
    name: new RegExp(req.body.inputName, "i"),
  });
  res.json(employeeList);
});

app.get("/api/robert", async (req, res) => {
  const employeesRobert = await EmployeeModel.find({
    name: /^Robert/,
  });
  res.json(employeesRobert);
});

app.post("/api/employees/", async (req, res, next) => {
  console.log(req.body);
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  const employee = req.body;

  try {
    const updated = await req.employee.set(employee).save();
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const deleted = await req.employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.use("/api/equipments/:id", async (req, res, next) => {
  let equipment = null;
  try {
    equipment = await Equipment.findById(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (!equipment) {
    return res.status(404).end("Equipment not found");
  }

  req.equipment = equipment;
  next();
});

app.get("/api/equipments/", async (req, res) => {
  const equipments = await Equipment.find({}).sort({
    created: "desc",
  });
  return res.json(equipments);
});

app.post("/api/equipments/", async (req, res, next) => {
  const equipment = req.body;
  try {
    const savedEquipment = await Equipment.create(equipment);
    return res.json(savedEquipment);
  } catch (e) {
    return next(e);
  }
});

app.get("/api/equipments/:id", (req, res) => {
  return res.json(req.equipment);
});

app.patch("/api/equipments/:id", async (req, res, next) => {
  const equipment = req.body;

  try {
    const updated = await req.equipment.set(equipment).save();
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/equipments/:id", async (req, res, next) => {
  try {
    const deleted = await req.equipment.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.use("/api/missing/:id", async (req, res, next) => {
  let missingEmployee = null;

  try {
    missingEmployee = await EmployeeModel.findById(req.params.id);
  } catch (err) {
    return next(err);
  }

  if (!missingEmployee) {
    return res.status(404).end("Employee not found");
  }

  req.missingEmployee = missingEmployee;
  next();
});

app.get("/api/missing/:id", (req, res) => {
  return res.json(req.missingEmployee);
});

app.post("/api/missing/", async (req, res) => {
  let employeeId = objectId(req.body.id);
  let employee = await EmployeeModel.findById(employeeId);
  await EmployeeModel.findByIdAndUpdate(employeeId, {
    presence: !employee.presence,
  });
  let allEmployees = await EmployeeModel.find();
  res.json({ result: allEmployees });
});

app.get("/api/missing/", async (req, res) => {
  let missingEmployees = await EmployeeModel.find({ presence: false });
  res.json(missingEmployees);
});

app.delete("/api/missing/:id", async (req, res, next) => {
  try {
    const deleted = await req.missingEmployee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/colors", async (req, res) => {
  const colorsData = await favColorModel.find();
  res.json(
    colorsData.map((color) => ({
      id: color._id,
      name: color.name,
    }))
  );
});

app.post("/api/checkMap", async (req, res) => {
  let employeeId = objectId(req.body.id);
  let employee = await EmployeeModel.findById(employeeId);
  await EmployeeModel.findByIdAndUpdate(employee, {
    map: !employee.map,
  });
  const result = await EmployeeModel.find({ position: req.body.position });
  res.json({ result: result });
});

app.post("/api/ticked", async (req, res) => {
  let employeeId = objectId(req.body.id);
  let employee = await EmployeeModel.findById(employeeId);
  await EmployeeModel.findByIdAndUpdate(employee, {
    map: !employee.map,
  });
  let result = await EmployeeModel.find();
  res.json({ result: result });
});

app.post("/api/company/", async (req, res, next) => {
  console.log(req.body);
  const company = req.body;

  try {
    const saved = await Company.create(company);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/company/", async (req, res, next) => {
  try {
    const companies = await Company.find();
    return res.json(companies);
  } catch (err) {
    return next(err);
  }
});

const main = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
