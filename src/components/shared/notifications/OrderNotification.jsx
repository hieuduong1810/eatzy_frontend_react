import { useRef, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, FileText } from "lucide-react";
import "./OrderNotification.css";

const OrderNotification = ({ title, message, type = "info", onClose, timestamp }) => {
    const progressRef = useRef(null);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.animation = "none";
            // Trigger reflow
            void progressRef.current.offsetWidth;
            progressRef.current.style.animation = "progress 5s linear forwards";
        }
    }, [title, message]);

    const getIcon = () => {
        switch (type) {
            case "success": return <CheckCircle size={28} color="#fff" strokeWidth={2.5} />;
            case "error": return <AlertCircle size={28} color="#fff" strokeWidth={2.5} />;
            default: return <Info size={28} color="#fff" strokeWidth={2.5} />;
        }
    };

    return (
        <div className="cust-notif-container">
            <div className={`cust-notif cust-notif--${type}`}>
                <div className="cust-notif-icon-box">
                    {getIcon()}
                </div>
                <div className="cust-notif-content">
                    <h4 className="cust-notif-title">{title}</h4>
                    <div className="cust-notif-message-wrapper">
                        <div className="cust-notif-message-pill">
                            <FileText size={14} />
                            <span>{message}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="cust-notif-close">
                    <X size={18} strokeWidth={2.5} />
                </button>
                <div className="cust-notif-progress-bar">
                    <div ref={progressRef} className="cust-notif-progress-fill" />
                </div>
            </div>
        </div>
    );
};

export default OrderNotification;
