import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import MissingTable from "../Components/MissingTable/MissingEmployeeTable";

const fetchMissingEmployees = (signal) => {
  return fetch("/api/missing", { signal }).then((res) => res.json());
};

const deleteMissingEmployee = (id) => {
  return fetch(`/api/missing/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const MissingDataList = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const handleDelete = (id) => {
    deleteMissingEmployee(id).catch((err) => {
      console.log(err);
    });

    setData((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchMissingEmployees(controller.signal)
      .then((employees) => {
        setLoading(false);
        setData(employees);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setData(null);
          throw error;
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <MissingTable employees={data} onDelete={handleDelete} />;
};

export default MissingDataList;
