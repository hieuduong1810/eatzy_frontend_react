import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, AlertTriangle, PiggyBank, Unlock, FilePen, FilePlus, Check, CheckCircle2 } from "lucide-react";
import SwipeToConfirm from "./SwipeToConfirm";
import "./SlideConfirmModal.css";

const SlideConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận hành động",
    description,
    isLoading = false,
    isSuccess = false,
    successTitle = "Hoàn tất!",
    type = "warning", // warning, success, danger, info, pink
    confirmDetails
}) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const [showProcessing, setShowProcessing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isSuccessInternal, setIsSuccessInternal] = useState(false);
    const [displayContent, setDisplayContent] = useState({
        title,
        description,
        type,
        confirmDetails,
        successTitle
    });

    useEffect(() => {
        if (isOpen && !isSuccessInternal) {
            setDisplayContent({
                title,
                description,
                type,
                confirmDetails,
                successTitle
            });
        }
    }, [isOpen, title, description, type, confirmDetails, successTitle, isSuccessInternal]);

    useEffect(() => {
        if (isSuccess) setIsSuccessInternal(true);
    }, [isSuccess]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
            // Reset states
            setIsCompleted(false);
            setShowProcessing(false);
            setIsSuccessInternal(false);
        } else {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
            }, 450); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isLoading && isCompleted) {
            const t = setTimeout(() => setShowProcessing(true), 50);
            return () => clearTimeout(t);
        } else if (!isLoading) {
            setShowProcessing(false);
        }
    }, [isLoading, isCompleted]);

    const handleConfirmComplete = () => {
        setIsCompleted(true);
        setTimeout(() => {
            onConfirm();
        }, 100);
    };

    if (!shouldRender) return null;

    // Determine theme classes based on type
    const getTheme = () => {
        const themeType = displayContent.type || "warning";
        switch (themeType) {
            case "warning":
                return {
                    accent: "accent-amber",
                    border: "border-amber",
                    bg: "bg-amber-soft",
                    iconColor: "#F59E0B"
                };
            case "danger":
                return {
                    accent: "accent-red",
                    border: "border-red",
                    bg: "bg-red-soft",
                    iconColor: "#EF4444"
                };
            case "success":
                return {
                    accent: "accent-emerald",
                    border: "border-emerald",
                    bg: "bg-emerald-soft",
                    iconColor: "#10B981"
                };
            case "info":
            default:
                return {
                    accent: "accent-blue",
                    border: "border-blue",
                    bg: "bg-blue-soft",
                    iconColor: "#3B82F6"
                };
        }
    };

    const theme = getTheme();

    const IconComponent = () => {
        const themeType = displayContent.type || "warning";
        switch (themeType) {
            case "warning": return <AlertTriangle size={24} className="text-amber-500" />;
            case "danger": return <AlertTriangle size={24} className="text-red-500" />;
            case "success": return <Check size={24} className="text-emerald-500" />;
            default: return <AlertTriangle size={24} className="text-blue-500" />;
        }
    };

    const shouldShowProcessing = showProcessing || (isLoading && isCompleted);

    return ReactDOM.createPortal(
        <div className={`scm-overlay ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div
                className={`scm-container-glass ${theme.border} ${theme.accent} ${isClosing ? 'closing' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="scm-header">
                    <div className="flex items-center gap-3">
                        <div className={`scm-icon-box ${theme.bg}`}>
                            <IconComponent />
                        </div>
                        <h3 className="scm-title">{displayContent.title}</h3>
                    </div>
                    <button className="scm-close-btn-glass" onClick={onClose} disabled={isCompleted || isLoading}>
                        <X size={18} />
                    </button>
                </div>

                <div className="scm-content-body">
                    {isSuccessInternal ? (
                        <div className="scm-success-state">
                            <div className="scm-success-icon-wrapper">
                                <CheckCircle2 size={64} className="text-emerald-500" />
                            </div>
                            <h4 className="scm-success-title">{displayContent.successTitle}</h4>
                            <p className="scm-success-desc">Hành động của bạn đã được thực hiện thành công.</p>
                        </div>
                    ) : shouldShowProcessing ? (
                        <div className="scm-processing-state">
                            <div className="scm-spinner-wrapper">
                                <div className="scm-loading-spinner-lg" style={{ borderTopColor: theme.iconColor }}></div>
                            </div>
                            <p className="scm-processing-text">Eatzy đang xử lý, sẽ xong ngay thôi...</p>
                        </div>
                    ) : (
                        <>
                            <p className="scm-desc">{displayContent.description}</p>

                            {displayContent.confirmDetails && (
                                <div className={`scm-details-box ${theme.bg}`}>
                                    {Object.entries(displayContent.confirmDetails).map(([label, value]) => (
                                        <div key={label} className="scm-detail-row">
                                            <span className="detail-label">{label}:</span>
                                            <span className="detail-value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="scm-swipe-wrapper">
                                <SwipeToConfirm
                                    onComplete={handleConfirmComplete}
                                    text={isCompleted ? "Đã xác nhận!" : "Vuốt để xác nhận"}
                                    disabled={isCompleted || isLoading}
                                    isLoading={isLoading}
                                    type={displayContent.type}
                                />
                            </div>

                            <p className="scm-instruction">
                                {isCompleted ? "Đang chuẩn bị xử lý..." : "Vuốt nút sang phải để xác nhận"}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SlideConfirmModal;
