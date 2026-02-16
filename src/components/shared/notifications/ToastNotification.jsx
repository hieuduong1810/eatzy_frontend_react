import { useRef, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, FileText } from "lucide-react";
import "./OrderNotification.css";

// Reuses the CSS from OrderNotification but adapted for react-toastify
const ToastNotification = ({ closeToast, title, message, type = "info" }) => {
    const progressRef = useRef(null);

    // React-toastify manages the lifecycle, so we don't need the progress bar animation logic here 
    // if we let toastify handle the progress bar.
    // However, OrderNotification has a custom progress bar visual.
    // Let's keep the visual and try to mimic it, or just use static if toastify handles autoClose.
    // Actually, toastify's default progress bar is at the bottom.
    // We can use our own if we want it to look exactly like OrderNotification.

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.animation = "none";
            void progressRef.current.offsetWidth;
            progressRef.current.style.animation = "progress 3s linear forwards"; // Sync with toastify autoClose
        }
    }, []);

    const getIcon = () => {
        switch (type) {
            case "success": return <CheckCircle size={28} color="#fff" strokeWidth={2.5} />;
            case "error": return <AlertCircle size={28} color="#fff" strokeWidth={2.5} />;
            default: return <Info size={28} color="#fff" strokeWidth={2.5} />;
        }
    };

    return (
        <div className={`cust-notif cust-notif--${type}`} style={{
            boxShadow: 'none', // Toastify adds its own shadow, but we might disable it
            background: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque
            margin: 0,
            width: '100%',
            maxWidth: '100%',
            border: 'none',
            pointerEvents: 'auto'
        }}>
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
            <button onClick={closeToast} className="cust-notif-close" type="button">
                <X size={18} strokeWidth={2.5} />
            </button>
            <div className="cust-notif-progress-bar">
                <div ref={progressRef} className="cust-notif-progress-fill" />
            </div>
        </div>
    );
};

export default ToastNotification;
