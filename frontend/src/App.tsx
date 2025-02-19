import { Route, Routes } from "react-router";

import Car from "./Components/Car";
import Cars from "./Components/Cars";
import Navbar from "./Components/Navbar";
import User from "./Components/User";

import AppointmentForm from "./Components/AppointmentForm";
import Appointments from "./Components/Appointments";
import BookCar from "./Components/BookCar";
import Login from "./Components/Login";


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
              <Route path="cars" element={<AdminCars />} />
              <Route path="cars/:id" element={<CarForm />} />
              {/* <Route path="create" element={<AppointmentForm />} /> */}
            </Route>
            <Route path="/services" element={<Services />} />
           
          <Route path="/user">
            <Route path=":id" element={<User />} />
            <Route path="login" element={<Login/>} />
          </Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
