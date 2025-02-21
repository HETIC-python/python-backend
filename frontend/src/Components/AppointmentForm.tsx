import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../api";
import { jwtDecode } from "jwt-decode";

// const services: { type?: ServiceType; label: string; description: string }[] = [
//   {
//     // type: "test_drive",
//     label: "Test Drive",
//     description: "Take the car for a test drive with our expert",
//   },
//   {
//     // type: "financial_advice",
//     label: "Financial Consultation",
//     description: "Get expert advice on financing options and lease terms",
//   },
//   {
//     // type: "maintenance",
//     label: "Maintenance Check",
//     description: "Complete vehicle inspection and maintenance consultation",
//   },
//   {
//     type: "inspection",
//     label: "Vehicle Inspection",
//     description: "Detailed inspection of the vehicle condition",
//   },
// ];

async function bookAppointment(formData: object) {
  const resp = await fetch(`${API_URL}/book-appointment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await resp.json();
  return data;
}

async function getServices() {
  const resp = await fetch(`${API_URL}/services`);
  const data = await resp.json();
  return data;
}

function useServices() {
  const [services, setServices] = useState([]);
  useEffect(() => {
    getServices().then((data) => {
      setServices(data?.data || []);
    });
  }, []);
  return services as { name: string; description: string }[];
}

export default function AppointmentForm() {
  const navigate = useNavigate();
  const services = useServices();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    carId: "",
    date: "", // TODO: date + time when sending the request
    time: "",
    serviceName: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token || "");
    setError(null);
    // Handle form submission
    const res = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      ...formData,
      date: `${formData.date}T${formData.time}:00Z`,
      user_id: decoded?.sub, // TODO: Replace with actual user ID
      service_id: services.find((s) => s.name === formData.serviceName)?.id,
      }),
    });
    if (res.status === 400) {
      setError("Please fill in all fields");
      return;
    }
    const data = await res.json();
    console.log(data);
    // bookAppointment(formData); // TODO: Implement this function
    console.log(formData);
    navigate("/appointments");
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services?.map((service) => (
              <div
                key={service?.name}
                className={`p-4 border rounded-lg cursor-pointer ${
                  formData.serviceName === service.name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceName: service.name,
                  }))
                }
              >
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              required
              className="w-full p-2 border rounded-md"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="w-full p-2 border rounded-md"
            rows={4}
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
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
}
