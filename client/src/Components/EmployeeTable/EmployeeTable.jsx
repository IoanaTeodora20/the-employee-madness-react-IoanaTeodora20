import { Link } from "react-router-dom";
import "./EmployeeTable.css";
import { useEffect, useState } from "react";
// import axios from "axios";
// const base_url = process.env.REACT_APP_API_URL;

const EmployeeTable = ({ employees, onDelete }) => {
  const [employeesData, setEmployeesData] = useState(employees);
  const [position, setPosition] = useState();
  const [level, setLevel] = useState();
  const [inputName, setInputName] = useState("");
  const [id, setId] = useState();
  const [sorting, setSorting] = useState({ field: "", type: 1 });
  const [error, setError] = useState(false);

  const sortTable = (field) => {
    setSorting({ field: field, type: !sorting.type });
  };

  const filterEmployees = (e) => {
    e.preventDefault();
    let employees = employeesData.map((item) => item.map);
    let employeesTicked = employees.filter((elem) => elem == true);
    if (employeesTicked.length == 1) {
      handlePositionClick(position, id);
      setError(false);
    } else if (employeesTicked.length > 1) {
      setError(true);
    }
  };

  const handlePresenceClick = async (id) => {
    fetch("http://localhost:8080/api/missing", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => setEmployeesData(data.result));
  };

  const handlePositionClick = async (position, id) => {
    fetch("http://localhost:8080/api/checkMap", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ position: position, id: id }),
    })
      .then((response) => response.json())
      .then((data) => setEmployeesData(data.result));
  };

  // const handlePositionTicked = async (id) => {
  //   fetch("http://localhost:8080/api/ticked", {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id: id }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => setEmployeesData(data.result));
  // };
  const positions = Array.from(
    new Set(employees.map((employee) => employee.position))
  );

  const levels = Array.from(
    new Set(employees.map((employee) => employee.level))
  );

  useEffect(() => {
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
    setError(false);
  };

  useEffect(() => {
    fetch("/api/inputName", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputName }),
    })
      .then((response) => response.json())
      .then((data) => setEmployeesData(data));
  }, [inputName]);

  return (
    <div className="EmployeeTable">
      <table>
        <thead>
          <tr>
            <th>Present</th>
            <th onClick={() => sortTable("name")}>Name</th>
            <th>Level</th>
            <th>Position</th>
            <th>Company</th>
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
              <input
                type="text"
                placeholder="Search by Name"
                onChange={(e) => {
                  e.preventDefault();
                  setInputName(e.target.value);
                }}
              />
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
                <input
                  type="checkbox"
                  id="present"
                  name="present"
                  checked={employee.presence ? "checked" : ""}
                  onChange={() => handlePresenceClick(employee._id)}
                />
              </td>
              <td>{employee.name}</td>
              <td>{employee.level}</td>
              <td>{employee.position}</td>
              <td>{employee.company}</td>
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

export default EmployeeTable;
