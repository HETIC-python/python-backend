import React, { useEffect, useState } from "react";
import { API_URL } from "../../api";
import { useNavigate } from "react-router";

interface Appointment {
  id: number;
  user_id: number;
  service_id: number;
  service_name: string;
  date: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_URL}/appointments`);
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="container mx-auto px-4 py-8"></div>
      <h1 className="text-2xl font-bold mb-6">All Appointments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{appointment.id}</td>
                <td className="px-6 py-4">{appointment.user_id}</td>
                <td className="px-6 py-4">{appointment.service_name}</td>
                <td className="px-6 py-4">
                  {new Date(appointment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                    <button
                    onClick={() => {
                      navigate(`/admin/appointments/${appointment.id}`);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out text-sm font-medium shadow-md hover:shadow-lg"
                    >
                    Change date
                    </button>
                  {/* <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
