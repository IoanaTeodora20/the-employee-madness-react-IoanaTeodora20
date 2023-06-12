import { Link } from "react-router-dom";
import "./MissingTable.css";
import { useEffect, useState } from "react";
// import axios from "axios";
// const base_url = process.env.REACT_APP_API_URL;

const MissingTable = ({ employees, onDelete }) => {
  const [missingData, setMissingData] = useState(employees);
  const [sortingName, setSortingName] = useState({ field: "", type: 1 });
  const [position, setPosition] = useState();
  const [level, setLevel] = useState();

  let positions = Array.from(
    new Set(employees.map((employee) => employee.position))
  );

  let levels = Array.from(new Set(employees.map((employee) => employee.level)));

  const sortTable = (field) => {
    setSortingName({ field: field, type: !sortingName.type });
  };

  useEffect(() => {
    let people = [...missingData];
    if (sortingName.field.length > 0) {
      people.sort((a, b) => {
        const firstName = a[sortingName.field].toUpperCase();
        const secondName = b[sortingName.field].toUpperCase();
        if (firstName < secondName) {
          return -1;
        }
        if (firstName > secondName) {
          return 1;
        }
        return 0;
      });
    }
    setMissingData(sortingName.type ? people : people.reverse());
  }, [sortingName]);

  useEffect(() => {
    let employeesList = [...employees];
    setMissingData(
      employeesList.filter((employee) => {
        return (
          (!position || position === employee.position) &&
          (!level || level === employee.level)
        );
      })
    );
  }, [position, level]);

  const clearAllFilters = (e) => {
    e.preventDefault();
    setLevel(false);
    setPosition(false);
  };

  return (
    <div className="EmployeeTable">
      <table>
        <thead>
          <tr>
            <th onClick={() => sortTable("name")}>Name</th>
            <th>Position</th>
            <th>Level</th>
            <th>
              <select onChange={(e) => setPosition(e.target.value)}>
                <option value="" disabled default selected>
                  Select Position
                </option>

                {positions.map((position) => {
                  return <option key={position}>{position}</option>;
                })}
              </select>
              <select onChange={(e) => setLevel(e.target.value)}>
                <option value="" disabled default selected>
                  Select Level
                </option>

                {levels.map((level) => {
                  return <option key={level}>{level}</option>;
                })}
              </select>
            </th>
            <th>
              <button onClick={(e) => clearAllFilters(e)}>
                Clear All filters
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {missingData.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button">Edit</button>
                </Link>
                <button type="button" onClick={() => onDelete(employee._id)}>
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

export default MissingTable;
