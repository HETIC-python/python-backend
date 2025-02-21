import { Route, Routes } from "react-router";

import Car from "./Components/Car";
import Cars from "./Components/Cars";
import Navbar from "./Components/Navbar";
import User from "./Components/User";

import AdminAuthenticated from "./Components/admin/AdminAuthentictated";
import AdminAppointments from "./Components/admin/Appointments";
import CarForm from "./Components/admin/CarForm";
import AdminCars from "./Components/admin/Cars";
import AppointmentForm from "./Components/AppointmentForm";
import Appointments from "./Components/Appointments";
import Authenticated from "./Components/Authenticated";
import BookCar from "./Components/BookCar";
import Login from "./Components/Login";
import Requests from "./Components/Requests";
import Services from "./Components/Services";
import Signup from "./Components/Signup";
import { UserProvider } from "./context/user";
import AppointmentChange from "./Components/admin/AppointmentChange";

function App() {
  //useEffect(() => {
  //  isUserAdmin();
  // }, []);
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
                <Route
                  index
                  element={
                    <AdminAuthenticated>
                      <h1>ADMIN</h1>
                    </AdminAuthenticated>
                  }
                />
                <Route
                  path="cars"
                  element={
                    <AdminAuthenticated>
                      <AdminCars />
                    </AdminAuthenticated>
                  }
                />
                <Route
                  path="cars/:id"
                  element={
                    <AdminAuthenticated>
                      <CarForm />
                    </AdminAuthenticated>
                  }
                />
                <Route
                  path="services"
                  element={
                    <AdminAuthenticated>
                      <Services />
                    </AdminAuthenticated>
                  }
                />
                <Route
                  path="appointments"
                  element={
                    <AdminAuthenticated>
                      <AdminAppointments />
                    </AdminAuthenticated>
                  }
                />
                <Route
                  path="appointments/:id"
                  element={
                    <AdminAuthenticated>
                      <AppointmentChange />
                    </AdminAuthenticated>
                  }
                />
              </Route>

              <Route path="/user">
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route
                  index
                  element={
                    <Authenticated>
                      <User />
                    </Authenticated>
                  }
                />
                <Route path="requests" element={<Requests />} />
              </Route>
            </Routes>
          </main>
        </div>
      </UserProvider>
    </>
  );
}

export default App;
