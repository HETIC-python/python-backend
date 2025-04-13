import { useEffect, useState } from "react";
import { Link } from "react-router";
import { API_URL } from "../api";
import { Car } from "./types/car";

// Filter Controls Component
const FilterControls = ({
  filters,
  handleFilterChange,
  uniqueBrands,
  uniqueYears,
}: {
  filters: typeof initialFilters;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  uniqueBrands: string[];
  uniqueYears: number[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Brand
      </label>
      <select
        name="brand"
        value={filters.brand}
        onChange={handleFilterChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">All Brands</option>
        {uniqueBrands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Min Price
      </label>
      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleFilterChange}
        placeholder="Min Price"
        className="w-full p-2 border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Max Price
      </label>
      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleFilterChange}
        placeholder="Max Price"
        className="w-full p-2 border rounded-md"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Year
      </label>
      <select
        name="year"
        value={filters.year}
        onChange={handleFilterChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">All Years</option>
        {uniqueYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Car Card Component
const CarCard = ({ car }: { car: Car }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <img
      src={car?.picture}
      alt={`${car?.brand} ${car?.name}`}
      className="w-full h-48 object-cover"
    />
    {/* {JSON.stringify(car)} */}
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">
        {car?.brand} {car?.name}
      </h2>
      <p className="text-gray-600 mb-2">Model: {car?.model}</p>
      <p className="text-gray-600 mb-2">Year: {car?.year}</p>
      <p className="text-2xl font-bold text-green-600">
        ${car?.price?.toLocaleString()}
      </p>
      <Link to={`/car/${car?.id}`}>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          View Details
        </button>
      </Link>
    </div>
  </div>
);

// Results Count Component
const ResultsCount = ({ count }: { count: number }) => (
  <div className="mb-4 text-gray-600">Found {count} cars</div>
);

// Main Cars Component
const initialFilters = {
  brand: "",
  minPrice: "",
  maxPrice: "",
  year: "",
};

async function fetchCars() {
  console.log("fetching cars", `${API_URL}/cars`);
  const response = await fetch(`${API_URL}/cars`);
  return response.json();
}

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    fetchCars().then((data) => {
      setCars(data);
      setFilteredCars(data);
    });
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    let result = [...cars];

    if (filters.brand) {
      result = result.filter((car) => car.brand === filters.brand);
    }
    if (filters.minPrice) {
      result = result.filter((car) => car.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((car) => car.price <= Number(filters.maxPrice));
    }
    if (filters.year) {
      result = result.filter((car) => car.year === Number(filters.year));
    }

    setFilteredCars(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand)));
  const uniqueYears = Array.from(new Set(cars.map((car) => car.year))).sort();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Available Cars</h1>

      <FilterControls
        filters={filters}
        handleFilterChange={handleFilterChange}
        uniqueBrands={uniqueBrands}
        uniqueYears={uniqueYears}
      />

      <ResultsCount count={filteredCars.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
