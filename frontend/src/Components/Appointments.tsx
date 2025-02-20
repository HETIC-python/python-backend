import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Appointment } from "./types/appointment";
import { API_URL } from "../api";

const mockAppointments: Appointment[] = [
  {
    id: 1,
    userId: 1,
    carId: 1,
    date: "2024-02-20",
    time: "14:00",
    status: "confirmed",
    serviceType: "test_drive",
    car: {
      brand: "Tesla",
      model: "Model S",
      imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40712e9c",
    },
  },
  // Add more mock appointments...
];

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <div className="flex items-center gap-4">
      {/* <img
        src={appointment.car.imageUrl}
        alt={`${appointment.car.brand} ${appointment.car.model}`}
        className="w-24 h-24 object-cover rounded-md"
      /> */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">
              {appointment?.car?.brand} {appointment?.car?.model}
            </h3>
            <p className="text-gray-600">
              {new Date(appointment.date).toLocaleDateString()} at{" "}
              {appointment.date}
            </p>
            <p className="text-gray-600 capitalize">
              Service: {appointment?.service_name || "TODO"}
            </p>
          </div>
          {/* <span
            className={`px-3 py-1 rounded-full text-sm ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : appointment.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {appointment?.status?.charAt(0).toUpperCase() +
              appointment?.status?.slice(1)}
          </span> */}
        </div>
      </div>
    </div>
  </div>
);

export default function Appointments() {
  const USER_ID = 1; // Replace with actual user ID
  const [apiState, setApiState] = useState<
    "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  async function getAppointments() {
    try {
      setApiState("LOADING");
      const res = await fetch(`${API_URL}/appointments/user/${USER_ID}`); // Replace USER_ID with actual user ID
      const data = await res.json();
      setAppointments(data);
      setApiState("SUCCESS");
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  }

  useEffect(() => {
    // Replace with actual API call
    // setAppointments(mockAppointments);
    getAppointments();
  }, []);

  if (apiState === "LOADING") return <div>Loading...</div>;
  if (apiState === "IDLE") return <div>Loading...</div>;
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Link
          to="/appointments/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Book New Appointment
        </Link>
      </div>
      {appointments?.length === 0 ? (
        <div>You do not have any appointment</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
