import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  cars: {
    id: number;
    brand: string;
    model: string;
  }[];
  joinDate: string;
  profileImage: string;
}

export default function User() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API fetch
    const mockUser: User = {
      id: Number(id),
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: {
        street: "123 Main Street",
        city: "New York",
        country: "USA",
        zipCode: "10001",
      },
      cars: [
        { id: 1, brand: "Tesla", model: "Model S" },
        { id: 2, brand: "BMW", model: "M3" },
      ],
      joinDate: "2024-01-15",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    };

    setUser(mockUser);
  }, [id]);

  if (!user) return <div>Loading...</div>;

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
              src={user.profileImage}
              alt={user.name}
              className="w-48 h-48 rounded-full mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-center mb-2">{user.name}</h1>
            <p className="text-gray-600 text-center mb-4">
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {user.phone}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Address</h2>
                <div className="space-y-2">
                  <p>{user.address.street}</p>
                  <p>
                    {user.address.city}, {user.address.zipCode}
                  </p>
                  <p>{user.address.country}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Cars Owned</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.cars.map((car) => (
                  <div key={car.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">
                      {car.brand} {car.model}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
