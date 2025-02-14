import { Route, Routes } from "react-router";
import Navbar from "./Components/Navbar";
import Cars from "./Components/Cars";
import Car from "./Components/Car";
import User from "./Components/User";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4">
        <Routes>
          <Route path="/">
            <Route index element={<Cars />} />
            <Route path="car/:id" element={<Car />} />
          </Route>
          <Route path="/user">
            <Route path=":id" element={<User />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
