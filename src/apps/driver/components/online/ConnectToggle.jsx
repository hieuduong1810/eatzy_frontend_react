import { Power } from "lucide-react";

const ConnectToggle = ({ online, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`driver-connect-toggle ${online ? "driver-connect-toggle--online" : ""}`}
        >
            <Power size={18} />
            {!online && <span>Bật kết nối</span>}
        </button>
    );
};

export default ConnectToggle;
