import { useEffect, useState } from "react";

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [colorsData, setColorsData] = useState([]);
  const [isSenior, setSeniorColor] = useState(false);
  const [color, setColor] = useState();
  const [isJunior, setJunior] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    let years_experience = ["years_experience", "0"];
    const formData = new FormData(e.target);
    if (![formData].includes(years_experience)) {
      [formData].push(years_experience);
    }
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
  }, []);

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
      {!isJunior ? (
        <div className="control">
          <label htmlFor="experience">Years of Experience:</label>
          <input
            defaultValue={employee ? employee.years_experience : null}
            name="years_experience"
            id="experience"
          />
        </div>
      ) : null}

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
