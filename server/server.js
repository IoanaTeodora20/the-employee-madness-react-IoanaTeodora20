require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./db/employee.model");
const Equipment = require("./db/equipmentSchema");
const positions = require("../server/populate/positions.json");
const levels = require("../server/populate/levels.json");
const PORT = 8080;

if (!process.env.MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
    //optionsuccessStatus solution for cors policy
  })
);

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
  const employees = await EmployeeModel.find({}).sort({
    created: "desc",
  });
  return res.json(employees);
});

app.get("/api/employees/:id", (req, res) => {
  return res.json(req.employee);
});

app.get("/api/robert", async (req, res) => {
  const employeesRobert = await EmployeeModel.find({
    name: /^Robert/,
  });
  res.json(employeesRobert);
});

app.post("/api/employees/", async (req, res, next) => {
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
