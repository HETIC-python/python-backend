import React from 'react';
import { Route, Routes } from "react-router";

import Navbar from "./Components/Navbar";
import Cars from "./Components/Cars";
import Car from "./Components/Car";
import User from "./Components/User";
import Appointments from "./Components/Appointments";
import AppointmentForm from "./Components/AppointmentForm";
import Services from './Components/Services';
import AdminCars from './Components/admin/Cars'
import CarForm from './Components/admin/CarForm';
import BookCar from './Components/BookCar';

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/">
              <Route index element={<Cars />} />
              <Route path="car/:id" element={<Car />} />
              <Route path="car/:id/book" element={<BookCar />} />
            </Route>
            <Route path="/user">
              <Route path=":id" element={<User />} />
            </Route>
            <Route path="/appointments">
              <Route index element={<Appointments />} />
              <Route path="create" element={<AppointmentForm />} />
            </Route>
            <Route path="/admin">
              <Route index element={<h1>ADMIN</h1>} />
              <Route path='cars' element={<AdminCars />} />
              <Route path='cars/:id' element={<CarForm />} />
              {/* <Route path="create" element={<AppointmentForm />} /> */}
            </Route>
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
