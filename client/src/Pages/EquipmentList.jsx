import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EquipmentTable from "../Components/EquipmentTable/EquipmentTable";

const fetchEquipments = (signal) => {
  return fetch("/api/equipments", { signal }).then((res) => res.json());
};

const deleteEquipments = (id) => {
  return fetch(`/api/equipments/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EquipmentList = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const handleDelete = (id) => {
    deleteEquipments(id).catch((err) => {
      console.log(err);
    });

    setData((equipment) => {
      return equipment.filter((equipment) => equipment._id !== id);
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchEquipments(controller.signal)
      .then((equipments) => {
        setLoading(false);
        setData(equipments);
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

  return <EquipmentTable equipmentData={data} onDelete={handleDelete} />;
};

export default EquipmentList;
