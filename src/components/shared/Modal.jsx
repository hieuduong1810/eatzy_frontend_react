import { useEffect, useState } from "react";
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
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
        } else if (isVisible) {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
            }, 300); // 300ms matches CSS animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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

    if (!isVisible) return null;

    return (
        <div className={`modal-overlay ${isClosing ? "closing" : ""}`} onClick={onClose}>
            <div
                className={`modal-container modal-${size} ${isClosing ? "closing" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {!hideHeader && (
                    <div className="modal-header">
                        <div>
                            {/* Check if title is a React Element or string */}
                            {typeof title === 'string' ? (
                                <h2 className="modal-title">{title}</h2>
                            ) : (
                                title
                            )}
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
