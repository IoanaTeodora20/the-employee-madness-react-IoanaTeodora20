import { Link } from "react-router-dom";
import "./EquipmentTable.css";
// import { useEffect, useState } from "react";
// import axios from "axios";
// const base_url = process.env.REACT_APP_API_URL;

const EquipmentTable = ({ equipmentData, onDelete }) => {
  // const [employeesData, setEmployeesData] = useState(employees);

  return (
    <div className="EquipmentTable">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {equipmentData.map((equipment) => (
            <tr key={equipment._id}>
              <td>{equipment.name}</td>
              <td>{equipment.type}</td>
              <td>{equipment.amount}</td>
              <td>
                <Link to={`/updateEquipments/${equipment._id}`}>
                  <button type="button">Update</button>
                </Link>
                <button type="button" onClick={() => onDelete(equipment._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
