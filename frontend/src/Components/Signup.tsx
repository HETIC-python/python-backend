import { useNavigate } from "react-router";
import React, { useState } from "react";
import { API_URL } from "../api";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;
  job: string;
  income: number; 
  password: string;
  confirmPassword: string;
  phone: number;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: number;
  };
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    birthdate: new Date(),
    job: "",
    income: 10000,
    lastname :"",
    email: "",
    password: "",
    confirmPassword: "",
    phone: +33,
    address: {
      street: "",
      city: "",
      country: "",
      zipCode: 0,
    },
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      ['address']: {...prevData['address'],[name.split('.')[1]] : value},
    }));
    console.log(formData);
    
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(validate(formData));
    setIsSubmitting(true);
  };

  const validate = (values: FormData) => {
    const errors: any = {};
    if (!values.firstname) errors.firstname = "Firstname is required";
    if (!values.lastname) errors.lastname = "Lastname is required";
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!values.phone) errors.phone = "Phone number is required";
    if (!values.address.street) errors.address = "Street address is required";
    if (!values.address.city) errors.address.city = "City is required";
    if (!values.address.zipCode) errors.address.zipCode = "Zip code is required";
    return errors;
  };

  const handleSuccess = async () => {
    
      try {
          const response = await fetch(`${API_URL}/register`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
          const data = await response.json();
          if (data.success) {
            navigate("/user/login");
          }
      } catch (err) {
          console.error(err);
          setErrors("Erreur lors de l'enregistrement de l'utilisateur");
      }
  };

  // When form is successfully submitted (no validation errors)
  if (isSubmitting && Object.keys(errors).length === 0) {
    handleSuccess();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Firstname Field */}
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
          </div>

          {/* Lastname Field */}
          <div className="mb-4">
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                      {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                    </div>
                    
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Address Section */}
          <div className="mb-4">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="address.street"
              value={formData.address.street}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* City Field */}
          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Zip Code Field */}
          <div className="mb-4">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <input
              type="number"
              id="zipCode"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Country Field */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="address.country"
              value={formData.address.country}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Birthdate Field */}
          <div className="mb-4">
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate.toISOString().split('T')[0]}
              onChange={(e) => setFormData((prevData) => ({
                ...prevData,
                birthdate: new Date(e.target.value),
              }))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Job Field */}
          <div className="mb-4">
            <label htmlFor="job" className="block text-sm font-medium text-gray-700">
              Job
            </label>
            <input
              type="text"
              id="job"
              name="job"
              value={formData.job}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Income Field */}
          <div className="mb-4">
            <label htmlFor="income" className="block text-sm font-medium text-gray-700">
              Income
            </label>
            <input
              type="number"
              id="income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
