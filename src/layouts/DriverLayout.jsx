import { NavLink, useLocation } from "react-router-dom";
import { Home, History, Wallet, User } from "lucide-react";
import "./DriverLayout.css";

const tabs = [
    { id: "home", label: "Home", path: "home", Icon: Home },
    { id: "history", label: "History", path: "history", Icon: History },
    { id: "wallet", label: "Wallet", path: "wallet", Icon: Wallet },
    { id: "profile", label: "Profile", path: "profile", Icon: User },
];

const DriverLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="driver-root">
            <div className="driver-content">{children}</div>
            <div className="driver-bottombar-wrapper">
                <nav className="driver-bottombar">
                    {tabs.map(({ id, label, path, Icon }) => {
                        const active = location.pathname.endsWith(`/${path}`);
                        return (
                            <NavLink key={id} to={`/${path}`} className={`driver-tab ${active ? "driver-tab--active" : ""}`}>
                                <div className="driver-tab-inner">
                                    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                                    {active && <span className="driver-tab-label">{label}</span>}
                                </div>
                                {active && <div className="driver-tab-bg" />}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default DriverLayout;
