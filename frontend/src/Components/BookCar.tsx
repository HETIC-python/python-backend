import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { API_URL } from "../api";
import { Car } from "./types/car";
import { jwtDecode } from "jwt-decode";

export default function BookCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
    type: "test_drive", // Default to test drive
  });

  useEffect(() => {
    // Fetch car details
    const fetchCar = async () => {
      try {
        const response = await fetch(`${API_URL}/cars/${id}`);
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError("Error loading car details");
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token")
      const decoded = jwtDecode(token || "");
      const response = await fetch(`${API_URL}/carAppointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          car_id: id,
          user_id: decoded?.sub, // TODO: Replace with actual user ID
          ...formData,
          start_date: `${formData.date} ${formData.time}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      navigate("/appointments"); // Or wherever you want to redirect after booking
    } catch (err) {
      setError("Failed to book test drive");
    }
  };

  if (!car) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Book a Test Drive</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold text-lg mb-2">Selected Car</h2>
        <div className="flex items-center gap-4">
          {car.picture && (
            <img 
              src={car.picture} 
              alt={car.name} 
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <div>
            <p className="font-medium">{car.brand} {car.name}</p>
            <p className="text-gray-600">{car.model} - {car.year}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded-md"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Any special requests or questions?"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
}
