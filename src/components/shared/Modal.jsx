import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = "md",
    footer,
    hideHeader = false,
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-container modal-${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {!hideHeader && (
                    <div className="modal-header">
                        <div>
                            <h2 className="modal-title">{title}</h2>
                            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
                        </div>
                        <button className="modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="modal-body">{children}</div>

                {/* Footer */}
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
