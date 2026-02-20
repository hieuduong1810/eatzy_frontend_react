import { X, Play, Pause, CheckCircle, ShieldCheck, Mail, Star, Bike, CreditCard, ChevronRight, FileText, Wallet } from "lucide-react";
import "./DriverDetail.css";

const DriverDetail = ({ driver, onClose }) => {
    if (!driver) return null;

    const formatCurrency = (val) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

    return (
        <div className="driver-detail-overlay" onClick={onClose}>
            <div className="driver-detail-container" onClick={(e) => e.stopPropagation()}>

                {/* Header Card */}
                <div className="driver-header-card">
                    <div className="driver-avatar-box">
                        <img
                            src={driver.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.user?.name || "Dr")}&background=random`}
                            className="driver-avatar-img"
                            alt="avatar"
                        />
                        <div className={`driver-pause-btn ${driver.status !== 'AVAILABLE' ? 'closed' : ''}`}>
                            {driver.status === 'AVAILABLE' ? (
                                <Play size={16} fill="white" strokeWidth={0} />
                            ) : (
                                <Pause size={16} fill="white" strokeWidth={0} />
                            )}
                        </div>
                    </div>

                    <div className="driver-header-info">
                        <div className="driver-badges">
                            <span className="d-badge">MOTORBIKE</span>
                            <span className="d-badge green">PARTNER ID #{driver.id}</span>
                        </div>
                        <h1 className="driver-name">{driver.user?.name || "Unknown Driver"}</h1>

                        <div className="driver-header-actions">
                            <div className="header-pill">
                                <Mail size={16} />
                                {driver.user?.email}
                            </div>
                            <div className="header-pill gold">
                                <Star size={16} fill="#facc15" strokeWidth={0} />
                                {driver.averageRating || "5.0"} <span style={{ opacity: 0.6, fontSize: '11px', marginLeft: '4px' }}>| {driver.completedTrips || 0} TRIPS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="driver-content-grid">

                    {/* Left Column: Compliance & Finance */}
                    <div>
                        <div className="d-card-white">
                            <div className="section-title">
                                <div className="icon-box text-blue-500 bg-blue-50">
                                    <ShieldCheck size={20} />
                                </div>
                                Compliance Dossier
                            </div>

                            <div className="compliance-grid">
                                {["Identity Profile", "National Credentials", "Mobility Permit", "Financial Channel", "Vehicle Authority", "Asset Protection"].map((item, idx) => (
                                    <div className="check-item" key={idx}>
                                        <div className="check-label">
                                            <CheckCircle size={16} strokeWidth={3} />
                                            {item}
                                        </div>
                                        <div className="check-status">APPROVED</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="fin-section-container">
                            <div className="section-header-row">
                                <div className="section-title" style={{ color: '#65a30d', marginBottom: 0 }}>
                                    <div className="icon-box" style={{ background: 'transparent', color: '#65a30d', padding: 0, width: 'auto', height: 'auto' }}>
                                        <Wallet size={20} strokeWidth={2.5} />
                                    </div>
                                    FINANCIAL CAPABILITY
                                </div>
                                <div className="watermark-icon">
                                    <Wallet size={80} strokeWidth={1} />
                                </div>
                            </div>

                            <div className="fin-cards-row">
                                <div className="fin-light-card">
                                    <span className="fin-label-sm">COD ACCEPTANCE LIMIT</span>
                                    <div className="fin-value-lg">2.000.000đ</div>
                                </div>
                                <div className="fin-light-card">
                                    <span className="fin-label-sm">TAX IDENTIFICATION</span>
                                    <div className="fin-value-lg text-normal">1234567890</div>
                                </div>
                            </div>

                        </div>

                        <div className="fin-section-container">
                            <div className="section-title" style={{ color: '#374151', fontSize: '18px', marginBottom: '24px' }}>
                                <div className="icon-box-circle">
                                    <FileText size={20} />
                                </div>
                                PAYOUT INFORMATION
                            </div>

                            <div className="p-grid">
                                <div>
                                    <div className="p-label">BANK INSTITUTION</div>
                                    <div className="p-value">VIETCOMBANK</div>
                                </div>
                                <div>
                                    <div className="p-label">ACCOUNT HOLDER</div>
                                    <div className="p-value">NGUYEN VAN A</div>
                                </div>
                                <div>
                                    <div className="p-label">BRANCH LOCATION</div>
                                    <div className="p-value italic">Tan Binh Branch</div>
                                </div>
                                <div>
                                    <div className="p-label">ACCOUNT NUMBER</div>
                                    <div className="p-value green">0123456789</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Fleet & Identity */}
                    <div>
                        <div className="d-card-dark">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <div className="plate-label" style={{ marginBottom: 4 }}>FLEET INFO</div>
                                    <div className="section-title" style={{ marginBottom: 0, fontSize: '18px', letterSpacing: '1px' }}>ASSIGNED ASSET</div>
                                </div>
                                <div className="asset-icon" style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#84cc16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bike size={32} />
                                </div>
                            </div>

                            <div className="license-plate-display">
                                <div className="plate-label">LICENSE PLATE</div>
                                <div className="plate-number">{driver.vehicle_license_plate || "N/A"}</div>
                            </div>

                            <div className="vehicle-meta">
                                <div className="v-meta-item">
                                    <small>BRAND</small>
                                    <div>{driver.vehicle_brand || "Yamaha"}</div>
                                </div>
                                <div className="v-meta-item">
                                    <small>MODEL</small>
                                    <div>{driver.vehicle_model || "Sirius"}</div>
                                </div>
                            </div>
                            <div className="vehicle-meta pt-4 mt-4 border-t border-gray-700">
                                <div className="v-meta-item">
                                    <small>YEAR</small>
                                    <div>2020</div>
                                </div>
                                <div className="v-meta-item">
                                    <small>TYPE</small>
                                    <div>MOTORBIKE</div>
                                </div>
                            </div>
                        </div>

                        <div className="d-card-white">
                            <div className="section-title">
                                <div className="icon-box text-gray-500 bg-gray-100">
                                    <FileText size={20} />
                                </div>
                                Partner Identity
                            </div>

                            <div className="id-field">
                                <span className="id-label">National ID Number</span>
                                <div className="id-val">079203004455</div>
                            </div>
                            <div className="id-field">
                                <span className="id-label">Driver License Class</span>
                                <div className="id-val highlight">A1</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Audit */}
                <div className="audit-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div className="w-14 h-14 rounded-2xl" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(132, 204, 22, 0.15)', color: '#84cc16', borderRadius: '18px', border: '1px solid rgba(132, 204, 22, 0.1)' }}>
                            <ShieldCheck size={28} />
                        </div>
                        <div className="audit-info">
                            <h4>Partner Integrity Audit</h4>
                            <p>This profile contains sensitive identification. Ensure all documents are cross-verified against official national databases before approval.</p>
                        </div>
                    </div>
                    <button className="exit-btn" onClick={onClose}>
                        Close Dossier <ChevronRight size={18} strokeWidth={3} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DriverDetail;
