import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <div className="admin-page">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
