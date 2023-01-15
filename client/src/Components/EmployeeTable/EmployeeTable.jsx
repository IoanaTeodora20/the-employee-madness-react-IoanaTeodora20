import { Link } from "react-router-dom";
import "./EmployeeTable.css";
import { useEffect, useState } from "react";
// import axios from "axios";
// const base_url = process.env.REACT_APP_API_URL;

const EmployeeTable = ({ employees, onDelete, changeSearchOrFilter }) => {
  const [employeesData, setEmployeesData] = useState(employees);
  const [position, setPosition] = useState();
  const [level, setLevel] = useState();
  const [sorting, setSorting] = useState({ field: "", type: 1 });

  const sortTable = (field) => {
    setSorting({ field: field, type: !sorting.type });
  };

  const positions = Array.from(
    new Set(employees.map((employee) => employee.position))
  );

  const levels = Array.from(
    new Set(employees.map((employee) => employee.level))
  );

  useEffect(() => {
    console.log("asd");
    let employeesFiltered = [...employees];
    setEmployeesData(
      employeesFiltered.filter((employee) => {
        return (
          (!position || position === employee.position) &&
          (!level || level === employee.level)
        );
      })
    );
  }, [position, level]);

  useEffect(() => {
    let people = [...employeesData];
    if (sorting.field.length > 0) {
      people = people.sort((a, b) => {
        const firstName = a[sorting.field].toUpperCase();
        const secondName = b[sorting.field].toUpperCase();
        if (firstName < secondName) {
          return -1;
        }
        if (firstName > secondName) {
          return 1;
        }
        return 0;
      });
    }
    setEmployeesData(sorting.type ? people : people.reverse());
  }, [sorting]);

  const clearFilters = (e) => {
    e.preventDefault();
    setPosition(false);
    setLevel(false);
  };

  return (
    <div className="EmployeeTable">
      <table>
        <thead>
          <tr>
            <th>Present</th>
            <th onClick={() => sortTable("name")}>Name</th>
            <th>Level</th>
            <th>Position</th>
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
              <button onClick={(e) => clearFilters(e)}>
                Clear All filters
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {employeesData.map((employee) => (
            <tr key={employee._id}>
              <td>
                <input type="checkbox" id="present" name="present" />
              </td>
              <td>{employee.name}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>
                <Link to={`/update/${employee._id}`}>
                  <button type="button">Update</button>
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

export default EmployeeTable;
