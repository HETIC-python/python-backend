import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../api";
import { useUser } from "../context/user";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
  birthdate: string;
  city: string;
  adresse: string;
  zipcode: string;
  job: string;
  income: number;
  // password omitted for security
}

export default function User() {
  const navigate = useNavigate();
  const { updateUser, isAuthenticated } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  console.log(token);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !isAuthenticated) {
           navigate('/user/login', { replace: true });
          return;
        }

        const response = await fetch(`${API_URL}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
        updateUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Error fetching user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [isAuthenticated]); // removed updateUser from dependencies

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!user) return <div className="text-center p-4">User not found</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-8 bg-gray-50">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstname}`}
              alt={`${user?.firstname} ${user?.lastname}`}
              className="w-48 h-48 rounded-full mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-center mb-2">
              {user?.firstname} {user?.lastname}
            </h1>
            <p className="text-gray-600 text-center mb-4">
              Role: {user?.role}
            </p>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Birth Date:</span>{" "}
                    {new Date(user?.birthdate || "").toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-semibold">Job:</span> {user?.job}
                  </p>
                  <p>
                    <span className="font-semibold">Income:</span> €{user?.income}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Address</h2>
                <div className="space-y-2">
                  <p>{user?.adresse}</p>
                  <p>
                    <span className="font-semibold">City:</span> {user?.city}
                  </p>
                  <p>
                    <span className="font-semibold">Zip Code:</span> {user?.zipcode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
