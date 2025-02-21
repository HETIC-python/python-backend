import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { API_URL } from '../../api';
import NotFound from '../Notfound';

interface Appointment {
  id: number;
  user_id: number;
  service_id: number;
  service_name: string;
  date: string;
}

export default function AppointmentChange() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`${API_URL}/appointments/${id}`);
        if (!response.ok) {
          throw new Error("Appointment not found");
        }
        const data = await response.json();
        setAppointment(data);
        
        // Keep the UTC time without converting to local
        const dateObj = new Date(data.date);
        setFormData({
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toISOString().split('T')[1].slice(0, 5),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const dateTimeString = `${formData.date}T${formData.time}:00Z`;
      
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateTimeString,
        }),
      });

      if (!response.ok) throw new Error('Failed to update appointment');
      
      navigate('/admin/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <NotFound msg={error}/>
  if (!appointment) return <div className="text-center p-4">Appointment not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Change Appointment Date and Time</h2>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <p className="text-gray-600">Service: {appointment.service_name}</p>
          <p className="text-gray-600">User ID: {appointment.user_id}</p>
          <p className="text-gray-600">
            Current DateTime: {new Date(appointment.date).toLocaleString('en-US', {
              timeZone: 'UTC',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                New Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                New Time
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/appointments')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out text-sm font-medium shadow-md hover:shadow-lg"
            >
              {updating ? 'Updating...' : 'Update DateTime'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
