import { Routes, Route, Navigate } from "react-router-dom";
import AdminApp from "./apps/admin/AdminApp";
import DriverApp from "./apps/driver/DriverApp";
import RestaurantApp from "./apps/restaurant/RestaurantApp";
import CustomerApp from "./apps/customer/CustomerApp";

const App = () => {
  return (
    <Routes>
      <Route path="/driver/*" element={<DriverApp />} />
      <Route path="/home/*" element={<DriverApp />} />
      <Route path="/history/*" element={<DriverApp />} />
      <Route path="/wallet/*" element={<DriverApp />} />
      <Route path="/profile/*" element={<DriverApp />} />

      <Route path="/restaurant/*" element={<RestaurantApp />} />
      <Route path="/customer/*" element={<CustomerApp />} />

      {/* Admin App as root */}
      <Route path="/*" element={<AdminApp />} />
    </Routes>
  );
};

export default App;
