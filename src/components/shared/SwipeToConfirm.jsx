import { useEffect, useRef, useState } from 'react';
import { ChevronsRight } from 'lucide-react';
import './SwipeToConfirm.css';

const SwipeToConfirm = ({
    onComplete,
    text = "Quẹt để xác nhận",
    disabled = false,
    isLoading = false,
    className = "",
    type = "primary",
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const sliderRef = useRef(null);
    const knobRef = useRef(null);
    const initialPos = useRef(null);
    const [sliderWidth, setSliderWidth] = useState(0);

    useEffect(() => {
        if (sliderRef.current) setSliderWidth(sliderRef.current.offsetWidth);
        const onResize = () => {
            if (sliderRef.current) setSliderWidth(sliderRef.current.offsetWidth);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (disabled && !isLoading && !isComplete) reset();
    }, [disabled, isLoading, isComplete]);

    const isTouchEvent = (e) => {
        return e.touches !== undefined;
    };

    const startDrag = (e) => {
        if (disabled || isComplete || isLoading) return;
        const pos = isTouchEvent(e) ? e.touches[0]?.clientX ?? 0 : e.clientX;
        initialPos.current = pos;
        setIsDragging(true);
    };

    const onDrag = (e) => {
        if (!isDragging || disabled || isComplete || isLoading) return;
        // e.preventDefault(); // preventing default can block scrolling on mobile, handle carefully
        const pos = isTouchEvent(e) ? e.touches[0]?.clientX ?? 0 : e.clientX;
        const knobWidth = knobRef.current ? knobRef.current.offsetWidth : 44; // Default 44 based on CSS
        const maxDrag = sliderWidth - knobWidth - 12; // 12px padding total (6px each side)
        const dragDistance = pos - (initialPos.current ?? pos);
        const newPos = Math.max(0, Math.min(dragDistance, maxDrag));
        setDragPosition(newPos);

        if (newPos >= maxDrag * 0.95 && !hasCompleted) {
            setIsComplete(true);
            setHasCompleted(true);
            setDragPosition(maxDrag);
            setIsDragging(false);
            if (onComplete) onComplete();
        }
    };

    const endDrag = () => {
        if (!isDragging || isComplete || isLoading) return;
        setIsDragging(false);
        if (!isComplete) {
            reset();
        }
    };

    const reset = () => {
        setDragPosition(0);
        setIsComplete(false);
        setHasCompleted(false);
    };

    const theme = (() => {
        switch (type) {
            case "success": return { start: "#16a34a", end: "#22c55e" };
            case "warning": return { start: "#d97706", end: "#f59e0b" };
            case "danger": return { start: "#ef4444", end: "#dc2626" };
            case "info": return { start: "#0ea5e9", end: "#38bdf8" };
            case "pink": return { start: "#db2777", end: "#ec4899" };
            case "primary":
            default: return { start: "#0ea5e9", end: "#38bdf8" };
        }
    })();

    const knobWidth = 44; // Approximation or ref based
    // Calculate percentage for gradient
    const maxDragVal = sliderWidth - knobWidth - 12;
    const percent = isLoading ? 100 : (maxDragVal > 0 ? Math.min(100, (dragPosition / maxDragVal) * 100) : 0);

    return (
        <div
            ref={sliderRef}
            className={`stc-container ${className} ${!isLoading ? "shadow-md" : ""} ${disabled && !isLoading ? "stc-disabled" : ""}`}
            style={{
                background: isLoading
                    ? `linear-gradient(to right, #6b7280, #4b5563)`
                    : `linear-gradient(to right, ${theme.start} ${percent}%, ${theme.end} ${percent}%)`,
            }}
        >
            {/* Shimmering overlay effect */}
            <div className="stc-shimmer-overlay" />

            {/* Touch/click capture area */}
            <div
                className="stc-touch-area"
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                onMouseMove={onDrag}
                onTouchMove={onDrag}
                onMouseUp={endDrag}
                onTouchEnd={endDrag}
                onMouseLeave={endDrag}
            />

            {/* Slider Knob */}
            {!isLoading && (
                <div
                    ref={knobRef}
                    className="stc-knob"
                    style={{
                        transform: `translate(${dragPosition}px, -50%)`,
                        transition: isDragging ? "none" : "transform 0.3s ease-out",
                    }}
                >
                    <div className="stc-knob-inner">
                        <div className="stc-shimmer-container">
                            <ChevronsRight size={28} className="stc-shimmer-icon" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>
            )}

            {/* Text */}
            <span className={`stc-text-container ${isLoading ? 'justify-center p-0' : ''}`}>
                {isLoading && <div className="stc-loading-spinner" />}
                {text}
            </span>
        </div>
    );
};

export default SwipeToConfirm;
