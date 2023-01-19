/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const equipments = require("./equipments.json");
const colors = require("./colors.json");
const falseData = require("./falseData.json");
const favColorModel = require("../db/favColorModel");
const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipmentSchema");
const companyData = require("./companies.json");
const CompanyModel = require("../db/companySchema");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  let idList = await EquipmentModel.find();
  idList = idList.map((elem) => elem._id);

  const employees = names.map((name) => ({
    name,
    level: pick(levels),
    position: pick(positions),
    equipment: idList,
    map: pick(falseData),
    company: pick(companyData),
  }));

  await EmployeeModel.create(...employees);
  console.log("Employees created");
};

const populateEquipments = async () => {
  await EquipmentModel.deleteMany();
  await EquipmentModel.insertMany(equipments);
  console.log("Equipments created");
};

const populateCompanies = async () => {
  await CompanyModel.deleteMany();

  let company = companyData.map((s) => ({ name: s }));
  await CompanyModel.insertMany(company);
};

const populateColors = async () => {
  await favColorModel.deleteMany();
  await favColorModel.insertMany(colors);
  console.log("Colors Created");
};
const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployees();
  await populateEquipments();
  await populateColors();
  await populateCompanies();
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
