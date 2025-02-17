import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { API_URL } from "../api";

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
}

interface CarDetails extends Car {
  description: string;
  specs: {
    engine: string;
    transmission: string;
    horsepower: number;
    acceleration: string;
    topSpeed: string;
  };
}

async function getCar(id: number): Promise<CarDetails> {
  const response = await fetch(`${API_URL}/cars/${id}`);
  return response.json();
}
export default function Car() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarDetails | null>(null);

  useEffect(() => {
    if (id) {
      getCar(Number(id)).then((data) => {
        setCar(data);
      });
    }
    // Mock data - replace with actual API fetch
  }, [id]);

  if (!car) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img
          src={car?.imageUrl}
          alt={`${car?.brand} ${car?.name}`}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">
              {car?.brand} {car?.name}
            </h1>
            <p className="text-3xl font-bold text-green-600">
              ${car?.price?.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Model:</span> {car?.model}
                </p>
                <p>
                  <span className="font-semibold">Year:</span> {car?.year}
                </p>
                <p className="mt-4">{car?.description}</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Engine:</span>{" "}
                  {car?.specs?.engine}
                </p>
                <p>
                  <span className="font-semibold">Transmission:</span>{" "}
                  {car?.specs?.transmission}
                </p>
                <p>
                  <span className="font-semibold">Horsepower:</span>{" "}
                  {car?.specs?.horsepower} hp
                </p>
                <p>
                  <span className="font-semibold">Acceleration:</span>{" "}
                  {car?.specs?.acceleration}
                </p>
                <p>
                  <span className="font-semibold">Top Speed:</span>{" "}
                  {car?.specs?.topSpeed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
