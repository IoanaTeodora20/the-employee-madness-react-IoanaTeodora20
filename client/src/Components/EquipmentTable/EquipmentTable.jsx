import { Link } from "react-router-dom";
import "./EquipmentTable.css";

const EquipmentTable = ({ equipmentData, onDelete }) => {
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
                  <button type="button">Edit</button>
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
