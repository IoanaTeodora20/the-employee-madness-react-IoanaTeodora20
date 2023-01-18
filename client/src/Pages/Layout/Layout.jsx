import { Outlet, Link } from "react-router-dom";

import "./Layout.css";

const Layout = () => (
  <div className="Layout">
    <nav>
      <ul>
        <li className="grow">
          <Link to="/">Employees</Link>
          <br />
          <Link to="/equipmentTable">Equipments Table</Link>
          <br />
          <Link to="/missingEmployees">Missing Employees</Link>
        </li>
        <li>
          <Link to="/create">
            <button type="button">Create Employee</button>
          </Link>
          <Link to="/createEquip">
            <button type="button">Create Equipments</button>
          </Link>
        </li>
      </ul>
    </nav>
    <Outlet />
  </div>
);

export default Layout;
