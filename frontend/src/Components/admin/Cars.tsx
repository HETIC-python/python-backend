import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Car } from "../types/car";
import { API_URL } from "../../api";
import CarForm from "./CarForm";

interface CarResponse {
  success: boolean;
  data: Car[];
}

async function updateCars(body: object) {
  const response = await fetch(`${API_URL}/cars`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response.json();
}

const Cars: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Car>>({
    name: "",
    year: new Date().getFullYear(),
    model: "",
    brand: "",
    km: 0,
    type: "",
    code: "",
    engine: "",
    transmission: "",
    horsepower: 0,
    topSpeed: 0,
    availability: true,
    description: "",
    picture: "",
  });
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_URL}/cars`);
      const data: CarResponse = await response.json();
      if (Array.isArray(data)) {
        console.log(data);
        setCars(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error loading cars");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCar
        ? `${API_URL}/cars/${editingCar.id}`
        : `${API_URL}/cars`;
      const method = editingCar ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCars();
        setShowForm(false);
        setFormData({
          name: "",
          year: new Date().getFullYear(),
          model: "",
          brand: "",
          km: 0,
          type: "",
          code: "",
          engine: "",
          transmission: "",
          horsepower: 0,
          topSpeed: 0,
          availability: true,
          description: "",
          picture: "",
        });
        setEditingCar(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error saving car");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const response = await fetch(`${API_URL}/cars/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          await fetchCars();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Error deleting car");
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/cars/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Cars Management</h2>
        <button
          onClick={() => navigate('/admin/cars/new')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Car
        </button>
      </div>

      {showForm && (
        <CarForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          editingCar={editingCar}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">KM</th>
              <th className="px-4 py-2">Availability</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b">
                <td className="px-4 py-2">{car.name}</td>
                <td className="px-4 py-2">{car.brand}</td>
                <td className="px-4 py-2">{car.model}</td>
                <td className="px-4 py-2">{car.year}</td>
                <td className="px-4 py-2">{car.km}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      car.availability
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {car.availability ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(car.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cars;
