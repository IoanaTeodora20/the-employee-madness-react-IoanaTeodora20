import { useEffect, useState } from "react";

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [colorsData, setColorsData] = useState([]);
  const [isSenior, setSeniorColor] = useState(false);
  const [isJunior, setJunior] = useState(null);
  const [color, setColor] = useState();
  const [companyData, setCompanyData] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const entries = [...formData.entries()];

    console.log([...formData]);
    const employee = entries.reduce((acc, entry) => {
      const [k, v] = entry;
      acc[k] = v;

      return acc;
    }, {});
    return onSave(employee);
  };

  useEffect(() => {
    fetch("/api/colors", { method: "GET", credentials: "include" })
      .then((response) => response.json())
      .then((data) => setColorsData(data));
    fetch("/api/company", { method: "GET", credentials: "include" })
      .then((response) => response.json())
      .then((data) => setCompanyData(data));
  }, []);

  console.log(companyData);
  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      {employee && (
        <input type="hidden" name="_id" defaultValue={employee._id} />
      )}

      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          defaultValue={employee ? employee.name : null}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          onChange={(e) => {
            e.preventDefault();
            setSeniorColor(e.target.value === "Senior");
            setJunior(e.target.value === "Junior");
          }}
          name="level"
          id="level"
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          defaultValue={employee ? employee.position : null}
          name="position"
          id="position"
        />

        <div className="control">
          <label htmlFor="company">Company:</label>
          <input
            defaultValue={employee ? employee.company : null}
            name="company"
            id="company"
            list="list"
          />
          <datalist id="list">
            {companyData.map((company) => {
              return <option key={company._id} value={company.name} />;
            })}
          </datalist>
        </div>
      </div>
      {isSenior ? (
        <div className="control">
          <select name="color" onChange={(e) => setColor(e.target.value)}>
            <option value="" disabled default selected>
              Select Color
            </option>

            {colorsData.map((color) => {
              return (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              );
            })}
          </select>
        </div>
      ) : null}
      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Edit Employee" : "Create Employee"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
