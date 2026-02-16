import "./NavItem.css";

const NavItem = ({ icon, text, expanded, active, onClick, isLogout = false }) => {
    const classes = [
        "nav-item",
        active ? "active" : "",
        !expanded ? "collapsed" : "",
        isLogout ? "logout" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} onClick={onClick}>
            <span className="nav-item-icon">{icon}</span>
            {expanded && <span className="nav-item-text">{text}</span>}
        </div>
    );
};

export default NavItem;
