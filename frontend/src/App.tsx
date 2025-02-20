import { Route, Routes } from "react-router";

import Car from "./Components/Car";
import Cars from "./Components/Cars";
import Navbar from "./Components/Navbar";
import User from "./Components/User";

import AppointmentForm from "./Components/AppointmentForm";
import Appointments from "./Components/Appointments";
import BookCar from "./Components/BookCar";
import Login from "./Components/Login";
import Services from "./Components/Services";
import Signup from "./Components/Signup";
import CarForm from "./Components/admin/CarForm";
import AdminCars from "./Components/admin/Cars";
import { UserProvider } from "./context/user";
import Authenticated from "./Components/Authenticated";
import { isUserAdmin } from "./utils/user";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    isUserAdmin();
  }, []);
  return (
    <>
      <UserProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-4">
            <Routes>
              <Route path="/">
                <Route index element={<Cars />} />
                <Route path="car/:id" element={<Car />} />
                <Route
                  path="car/:id/book"
                  element={
                    <Authenticated>
                      <BookCar />
                    </Authenticated>
                  }
                />
              </Route>
              <Route path="/user">
                <Route path=":id" element={<User />} />
              </Route>
              <Route path="/appointments">
                <Route
                  index
                  element={
                    <Authenticated>
                      <Appointments />
                    </Authenticated>
                  }
                />
                <Route
                  path="create"
                  element={
                    <Authenticated>
                      <AppointmentForm />
                    </Authenticated>
                  }
                />
              </Route>
              <Route path="/admin">
                <Route index element={<h1>ADMIN</h1>} />
                <Route path="cars" element={<AdminCars />} />
                <Route path="cars/:id" element={<CarForm />} />
                {/* <Route path="create" element={<AppointmentForm />} /> */}
                <Route path="services" element={<Services />} />
              </Route>

              <Route path="/user">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route index element={<User />} />
              </Route>
            </Routes>
          </main>
        </div>
      </UserProvider>
    </>
  );
}

export default App;
