import React, { useState, useEffect } from "react";
import { X, Clock, Trash2, Check, Save, ChevronDown } from "lucide-react";
import "./WeeklyScheduleModal.css";

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

const TimePicker = ({ value, onChange, onClose }) => {
    const [h, m] = value.split(":");
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

    return (
        <div className="time-picker-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="tp-column">
                <div className="tp-header">GIỜ</div>
                <div className="tp-list">
                    {hours.map(hour => (
                        <div
                            key={hour}
                            className={`tp-item ${hour === h ? "selected" : ""}`}
                            onClick={() => onChange(`${hour}:${m}`)}
                        >
                            {hour}
                        </div>
                    ))}
                </div>
            </div>
            <div className="tp-column">
                <div className="tp-header">PHÚT</div>
                <div className="tp-list">
                    {minutes.map(minute => (
                        <div
                            key={minute}
                            className={`tp-item ${minute === m ? "selected" : ""}`}
                            onClick={() => {
                                onChange(`${h}:${minute}`);
                                onClose();
                            }}
                        >
                            {minute}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const WeeklyScheduleModal = ({ isOpen, onClose, onSave, initialSchedule }) => {
    const [schedule, setSchedule] = useState([]);
    const [hoverDayIndex, setHoverDayIndex] = useState(null);
    const [editingShift, setEditingShift] = useState(null); // { dayIndex, shiftIndex, open, close }
    const [activePicker, setActivePicker] = useState(null); // "open" | "close" | null

    useEffect(() => {
        if (isOpen && initialSchedule) {
            setSchedule(JSON.parse(JSON.stringify(initialSchedule)));
        }
    }, [isOpen, initialSchedule]);

    if (!isOpen) return null;

    const handleToggleDay = (index) => {
        const newSchedule = [...schedule];
        newSchedule[index].isOpen = !newSchedule[index].isOpen;
        if (newSchedule[index].isOpen && newSchedule[index].shifts.length === 0) {
            newSchedule[index].shifts = [{ open: "08:00", close: "22:00" }];
        }
        setSchedule(newSchedule);
    };

    const handleEditShift = (dayIndex, shiftIndex) => {
        const shift = schedule[dayIndex].shifts[shiftIndex];
        setEditingShift({ dayIndex, shiftIndex, ...shift });
        setActivePicker(null);
    };

    const handleUpdateEditingShift = (field, value) => {
        setEditingShift(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmShift = () => {
        if (!editingShift) return;
        const newSchedule = [...schedule];
        newSchedule[editingShift.dayIndex].shifts[editingShift.shiftIndex] = {
            open: editingShift.open,
            close: editingShift.close
        };
        setSchedule(newSchedule);
        setEditingShift(null);
        setActivePicker(null);
    };

    const handleDeleteShift = () => {
        if (!editingShift) return;
        const newSchedule = [...schedule];
        newSchedule[editingShift.dayIndex].shifts.splice(editingShift.shiftIndex, 1);
        if (newSchedule[editingShift.dayIndex].shifts.length === 0) {
            newSchedule[editingShift.dayIndex].isOpen = false;
        }
        setSchedule(newSchedule);
        setEditingShift(null);
        setActivePicker(null);
    };

    const handleSave = () => {
        onSave(schedule);
    };

    return (
        <div className="wsm-overlay" onClick={() => { onClose(); setActivePicker(null); }}>
            <div className="wsm-container" onClick={(e) => { e.stopPropagation(); setActivePicker(null); }}>
                {/* Header */}
                <div className="wsm-header" onClick={(e) => { e.stopPropagation(); }}>
                    <div className="wsm-header-left">
                        <div className="wsm-icon-box">
                            <Clock size={20} className="text-orange-500" />
                        </div>
                        <h2 className="wsm-title">WEEKLY SCHEDULE</h2>
                    </div>

                    {editingShift && (
                        <div className="wsm-editor-bar">
                            <div className="editor-group">
                                <span className="editor-label">FROM</span>
                                <div
                                    className="custom-select-trigger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActivePicker(activePicker === "open" ? null : "open");
                                    }}
                                >
                                    {editingShift.open} <ChevronDown size={14} />
                                    {activePicker === "open" && (
                                        <TimePicker
                                            value={editingShift.open}
                                            onChange={(val) => handleUpdateEditingShift("open", val)}
                                            onClose={() => setActivePicker(null)}
                                        />
                                    )}
                                </div>
                            </div>
                            <span className="editor-separator">-</span>
                            <div className="editor-group">
                                <span className="editor-label">TO</span>
                                <div
                                    className="custom-select-trigger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActivePicker(activePicker === "close" ? null : "close");
                                    }}
                                >
                                    {editingShift.close} <ChevronDown size={14} />
                                    {activePicker === "close" && (
                                        <TimePicker
                                            value={editingShift.close}
                                            onChange={(val) => handleUpdateEditingShift("close", val)}
                                            onClose={() => setActivePicker(null)}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="editor-divider"></div>
                            <button className="editor-btn delete" onClick={handleDeleteShift} title="Delete shift"><Trash2 size={18} /></button>
                            <button className="editor-btn confirm" onClick={handleConfirmShift} title="Apply changes"><Check size={18} /></button>
                            <button className="editor-btn cancel" onClick={() => { setEditingShift(null); setActivePicker(null); }} title="Cancel"><X size={18} /></button>
                        </div>
                    )}

                    <div className="wsm-header-actions">
                        <button className="wsm-save-btn" onClick={handleSave} title="Save changes">
                            <Save size={20} color="#6B7280" />
                        </button>
                        <button className="wsm-close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="wsm-grid-container">
                    <div className="wsm-grid-header">
                        <div className="time-col-spacer"></div>
                        {DAYS.map((day, i) => (
                            <div
                                key={day}
                                className="day-col-header"
                                onMouseEnter={() => setHoverDayIndex(i)}
                                onMouseLeave={() => setHoverDayIndex(null)}
                            >
                                <div className="day-header-content">
                                    <span>{day.toUpperCase()}</span>
                                    {hoverDayIndex === i && (
                                        <label className="wsm-switch">
                                            <input
                                                type="checkbox"
                                                checked={schedule[i]?.isOpen || false}
                                                onChange={() => handleToggleDay(i)}
                                            />
                                            <span className="wsm-slider"></span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="wsm-grid-body">
                        {/* Time Labels Column */}
                        <div className="time-col">
                            <div className="time-period">SÁNG</div>
                            <div className="time-period">TRƯA</div>
                            <div className="time-period">CHIỀU</div>
                            <div className="time-period">TỐI</div>

                            <div className="time-labels">
                                {(() => {
                                    // Markers now only show for the active editing shift
                                    if (!editingShift) {
                                        return (
                                            <>
                                                <span className="time-marker-noon" style={{ top: "45.8%" }}>11:00</span>
                                                <span className="time-label" style={{ top: "58.3%" }}>14:00</span>
                                                <span className="time-label" style={{ top: "75%" }}>18:00</span>
                                                <span className="time-label" style={{ top: "95.8%" }}>23:00</span>
                                            </>
                                        );
                                    }

                                    const { dayIndex, shiftIndex } = editingShift;
                                    const dayShifts = schedule[dayIndex].shifts;
                                    const minTime = dayShifts.length > 0 ? dayShifts.reduce((min, s) => s.open < min ? s.open : min, "23:59") : null;
                                    const maxTime = dayShifts.length > 0 ? dayShifts.reduce((max, s) => s.close > max ? s.close : max, "00:00") : null;

                                    const labels = [
                                        { time: minTime, className: "time-marker-start" },
                                        { time: "11:00", className: "time-marker-noon" },
                                        { time: "14:00", className: "time-label" },
                                        { time: "18:00", className: "time-label" },
                                        { time: maxTime, className: "time-marker-end" },
                                        { time: "23:00", className: "time-label" }
                                    ];

                                    return labels.map((l, idx) => {
                                        if (!l.time) return null;
                                        // Skip if redundant
                                        if (idx > 0 && l.time === labels[idx - 1].time) return null;

                                        return (
                                            <span
                                                key={`${l.time}-${idx}`}
                                                className={l.className}
                                                style={{ top: `${(parseInt(l.time.split(":")[0]) / 24) * 100}%` }}
                                            >
                                                {l.time}
                                            </span>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Day Columns */}
                        {DAYS.map((day, i) => (
                            <div
                                key={i}
                                className={`day-col ${schedule[i]?.isOpen ? "active" : "closed"}`}
                                onMouseEnter={() => setHoverDayIndex(i)}
                                onMouseLeave={() => setHoverDayIndex(null)}
                            >
                                {!schedule[i]?.isOpen ? (
                                    <div className="closed-label">CLOSED</div>
                                ) : (
                                    schedule[i]?.shifts.map((shift, si) => {
                                        // Calculate position and height based on time
                                        // Simple vertical placement for demo, we can refine this
                                        const startHour = parseInt(shift.open.split(":")[0]);
                                        const endHour = parseInt(shift.close.split(":")[0]);
                                        const top = (startHour / 24) * 100;
                                        const height = ((endHour - startHour) / 24) * 100;

                                        return (
                                            <div
                                                key={si}
                                                className={`shift-block ${editingShift?.dayIndex === i && editingShift?.shiftIndex === si ? "editing" : ""}`}
                                                style={{ top: `${top}%`, height: `${height}%` }}
                                                onClick={() => handleEditShift(i, si)}
                                            >
                                                <div className="shift-info">
                                                    <Clock size={10} /> {shift.open} - {shift.close}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyScheduleModal;
