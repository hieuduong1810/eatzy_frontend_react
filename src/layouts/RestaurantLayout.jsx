import { useLocation } from "react-router-dom";
import RestaurantSidebar from "../apps/restaurant/components/RestaurantSidebar";
import "./RestaurantLayout.css";

const RestaurantLayout = ({ children }) => {
    return (
        <div className="resto-root">
            <RestaurantSidebar />

            {/* Main content */}
            <div className="resto-main">
                {children}
            </div>
        </div>
    );
};

export default RestaurantLayout;
