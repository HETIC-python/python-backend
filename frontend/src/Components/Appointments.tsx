import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Appointment } from "./types/appointment";
import { API_URL } from "../api";
import { jwtDecode } from "jwt-decode";

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
              {new Date(appointment.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
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
  const [apiState, setApiState] = useState<
    "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [carAppointments, setCarAppointments] = useState<
    (Appointment & { car_id: number })[]
  >([]);

  async function fetchAllAppointments() {
    try {
      setApiState("LOADING");
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token || "");

      // Fetch both regular and car appointments
      const [appointmentsRes, carAppointmentsRes] = await Promise.allSettled([
        fetch(`${API_URL}/appointments/user/${decoded?.sub}`),
        fetch(`${API_URL}/carAppointments/user/${decoded?.sub}`),
      ]);

      const appointmentsData =
        appointmentsRes.status === "fulfilled"
          ? await appointmentsRes.value.json()
          : [];
      const carAppointmentsData =
        carAppointmentsRes.status === "fulfilled"
          ? await carAppointmentsRes.value.json()
          : [];

      setAppointments(appointmentsData);
      setCarAppointments(carAppointmentsData);
      setApiState("SUCCESS");
    } catch (error) {
      console.error("Error fetching appointments", error);
      setApiState("ERROR");
    }
  }

  useEffect(() => {
    fetchAllAppointments();
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
      {appointments.length === 0 && carAppointments.length === 0 ? (
        <div>You do not have any appointments</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          {carAppointments.map((carAppointment) => (
            <AppointmentCard
              key={`car-${carAppointment.id}`}
              appointment={{
                ...carAppointment,
                service_name: "Car Service",
                type: "car",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
