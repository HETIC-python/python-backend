import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Car } from "../types/car";
import { API_URL } from "../../api";

function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Car>>({
    name: "",
    year: new Date().getFullYear(),
    model: "",
    brand: "",
    km: 0,
    price: 0,
    type: "",
    code: "",
    engine: "",
    transmission: "",
    horsepower: 0,
    topSpeed: 0,
    availability: true,
    description: "",
    picture: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (id && id !== "new") {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/cars/${id}`);
      const data = await response.json();
      if (data) {
        setFormData((prev) => ({ ...prev, ...data }));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error loading car");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.[0]) {
      setFile(e.target.files[0]);
    }
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Read file as base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          picture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if(!file){
        setError("Please select a file first");
        return;
      }
      const url =
        id && id !== "new" ? `${API_URL}/cars/${id}` : `${API_URL}/cars`;
      const method = id && id !== "new" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, picture: undefined }),
      });

      const data = await response.json();
      if (data?.messages?.includes("updated")) {
        await handleSubmitUpload(e);
      }
      if (id != "new" && data.message?.includes("updated")) {
        navigate("/admin/cars");
      } else if (data.message?.includes("created")) {
        navigate("/admin/cars");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error(err);
      setError("Error saving car");
    }
  };

  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const url = `${API_URL}/cars/upload/${1}`;
      const response = await fetch(url, {
        method: "POST",
        // Remove the Content-Type header to let the browser set it with the boundary
        body: formDataObj,
      });

      const data = await response.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          picture: data.url,
        }));
        setPreviewUrl(data.url);
      }
    } catch (err) {
      setError("Error uploading file");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {id === "new" ? "Add New Car" : "Edit Car"}
        </h2>
        <button
          onClick={() => navigate("/admin/cars")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2 mb-6">
          <label className="block mb-2">Car Image:</label>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {(previewUrl || formData.picture) && (
                <img
                  src={previewUrl || formData.picture}
                  alt="Car preview"
                  className="w-48 h-48 object-cover rounded border"
                />
              )}
            </div>
            <div className="flex-grow">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                name="picture"
                required
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Choose Image
              </button>
              {(previewUrl || formData.picture) && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setFormData((prev) => ({ ...prev, picture: "" }));
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Brand:</label>
          <input
            type="text"
            value={formData?.brand || ""}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Model:</label>
          <input
            type="text"
            value={formData.model || ""}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Year:</label>
          <input
            type="number"
            value={formData.year || ""}
            onChange={(e) =>
              setFormData({ ...formData, year: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Kilometers:</label>
          <input
            type="number"
            value={formData.km || ""}
            onChange={(e) =>
              setFormData({ ...formData, km: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Type:</label>
          <input
            type="text"
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Code:</label>
          <input
            type="text"
            value={formData.code || ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Engine:</label>
          <input
            type="text"
            value={formData.engine || ""}
            onChange={(e) =>
              setFormData({ ...formData, engine: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Transmission:</label>
          <select
            value={formData.transmission || ""}
            onChange={(e) =>
              setFormData({ ...formData, transmission: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select Transmission</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Horsepower:</label>
          <input
            type="number"
            value={formData.horsepower || ""}
            onChange={(e) =>
              setFormData({ ...formData, horsepower: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Top Speed (km/h):</label>
          <input
            type="number"
            value={formData.topSpeed || ""}
            onChange={(e) =>
              setFormData({ ...formData, topSpeed: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price:</label>
          <input
            type="number"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4 col-span-2">
          <label className="block mb-2">Description:</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div className="mb-4 col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.availability}
              onChange={(e) =>
                setFormData({ ...formData, availability: e.target.checked })
              }
              className="rounded"
            />
            <span>Available</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 col-span-2"
        >
          {id === "new" ? "Add" : "Update"}
        </button>
      </form>
    </div>
  );
}

export default CarForm;
