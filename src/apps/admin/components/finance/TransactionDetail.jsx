import { useState, useEffect } from "react";
import { X, CheckCircle, Smartphone, MapPin, Package, AlertCircle, Wallet, XCircle, Loader } from "lucide-react";
import financeApi from "../../../../api/admin/financeApi";
import "./TransactionDetail.css";

const TransactionDetail = ({ transaction, onClose }) => {
    const [orderData, setOrderData] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (transaction?.order?.id) {
                setLoadingOrder(true);
                try {
                    const data = await financeApi.getOrderById(transaction.order.id);
                    setOrderData(data);
                } catch (error) {
                    console.error("Failed to fetch order details:", error);
                } finally {
                    setLoadingOrder(false);
                }
            }
        };

        if (transaction?.order?.id) {
            fetchOrderDetails();
        } else {
            setOrderData(null);
        }
    }, [transaction]);

    if (!transaction) return null;

    const formatCurrency = (val) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + " " + new Date(dateString).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const isSuccess = transaction.status === 'SUCCESS';
    const hasOrder = !!transaction.order?.id;

    return (
        <div className="transaction-detail-overlay" onClick={onClose}>
            <div className="transaction-detail-container" onClick={(e) => e.stopPropagation()}>

                {/* Sticky Header */}
                <div className="transaction-header-bar">
                    <div className="header-left">
                        <h2 className="dossier-title">TRANSACTION AUDIT</h2>
                        <div className="reference-id-chip">
                            <span className="chip-label">REFERENCE ID:</span>
                            <span className="chip-value">TX-{transaction.id}</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className={`status-pill ${isSuccess ? 'success' : 'other'}`}>
                            {isSuccess ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {transaction.status || "UNKNOWN"}
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <XCircle size={20} />
                        </button>
                    </div>
                </div>

                <div className="transaction-body-wrapper">

                    {/* Main Amount Card */}
                    <div className="amount-card-container">
                        <div className={`amount-icon-circle ${transaction.amount >= 0 ? 'green' : 'red'}`}>
                            {transaction.amount >= 0 ? "↙" : "↗"}
                        </div>
                        <div className="trans-type-label">{transaction.transactionType || "PAYMENT"}</div>
                        <div className={`large-amount-display ${transaction.amount >= 0 ? 'green' : 'red'}`}>
                            {transaction.amount >= 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="running-balance-label">RUNNING BALANCE</div>
                        <div className="running-balance-value">{formatCurrency(transaction.balanceAfter || 0)}</div>
                    </div>

                    {/* Info Grid */}
                    <div className="trans-info-grid">
                        <div className="trans-info-card">
                            <div className="trans-card-icon user">
                                <span className="icon-emoji">👤</span>
                            </div>
                            <div className="trans-card-details">
                                <span className="trans-card-label">ACCOUNT OWNER</span>
                                <span className="trans-card-value">{transaction.wallet?.user?.name || "CUSTOMER"}</span>
                            </div>
                        </div>
                        <div className="trans-info-card">
                            <div className="trans-card-icon date">
                                <span className="icon-emoji">📅</span>
                            </div>
                            <div className="trans-card-details">
                                <span className="trans-card-label">TRANSACTION DATE</span>
                                <span className="trans-card-value">{formatDate(transaction.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Log Description */}
                    <div className="log-description-card">
                        <div className="log-header">
                            <span className="log-icon">📄</span>
                            <span className="log-title">LOG DESCRIPTION</span>
                        </div>
                        <div className="log-content-box">
                            "{transaction.description || "No description provided"}"
                        </div>
                    </div>

                    {/* Full Order Specifications */}
                    {hasOrder && (
                        <div className="full-specs-section">
                            <div className="specs-header">
                                <Package size={18} className="text-green-600" />
                                <h3>FULL ORDER SPECIFICATIONS</h3>
                            </div>

                            {loadingOrder ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                                    <Loader className="animate-spin" size={24} style={{ margin: '0 auto 10px' }} />
                                    Loading order details...
                                </div>
                            ) : orderData ? (
                                <>
                                    {/* Delivery Route */}
                                    <div className="delivery-route-card">
                                        <div className="route-title">
                                            <MapPin size={16} />
                                            <span>Delivery Route</span>
                                        </div>

                                        <div className="route-visualization">
                                            <div className="route-step pickup">
                                                <div className="step-dot green"></div>
                                                <div className="step-info">
                                                    <span className="step-label green">PICK UP</span>
                                                    <span className="step-name">{orderData.restaurant?.name || "Restaurant"}</span>
                                                    <span className="step-address">{orderData.restaurant?.address || "Unknown Address"}</span>
                                                </div>
                                            </div>

                                            <div className="route-connector"></div>

                                            <div className="route-step dropoff">
                                                <div className="step-dot red">
                                                    <MapPin size={12} color="white" />
                                                </div>
                                                <div className="step-info">
                                                    <span className="step-label red">DROP OFF</span>
                                                    <span className="step-name">{orderData.deliveryAddress?.contactName || "Customer"}</span>
                                                    <span className="step-address">{orderData.deliveryAddress?.addressLine || "Delivery Address"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="guarantee-banner">
                                        <CheckCircle size={16} />
                                        <span>This order is protected by Eatzy Guarantee. <span className="link">Learn more</span></span>
                                    </div>

                                    {/* Order Items Section */}
                                    <div className="order-items-card" style={{ marginTop: '24px' }}>
                                        <div className="section-header">
                                            <div className="section-title">
                                                <Package size={20} />
                                                <span>Order Items</span>
                                            </div>
                                            <span className="item-count-badge">{orderData.orderItems?.length || 0} items</span>
                                        </div>

                                        <div className="order-item-list">
                                            {orderData.orderItems?.map((item, index) => (
                                                <div className="order-item-row" key={index}>
                                                    <div className="item-left">
                                                        <div className="item-qty">{item.quantity}x</div>
                                                        <div className="item-details">
                                                            <h4>{item.dish?.name || "Unknown Item"}</h4>
                                                            <span className="item-variant">
                                                                {item.orderItemOptions?.map(opt => opt.menuOption?.name).join(", ") || "Standard option"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="item-price">{formatCurrency(item.priceAtPurchase)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-summary">
                                            <div className="order-summary-row">
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(orderData.subtotal)}</span>
                                            </div>
                                            <div className="order-summary-row">
                                                <span>Delivery Fee</span>
                                                <span>{formatCurrency(orderData.deliveryFee)}</span>
                                            </div>
                                            {orderData.discountAmount > 0 && (
                                                <div className="order-summary-row">
                                                    <span>Discount <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>VOUCHER</span></span>
                                                    <span style={{ color: '#15803d' }}>-{formatCurrency(orderData.discountAmount)}</span>
                                                </div>
                                            )}
                                            <div className="order-summary-row">
                                                <span>Payment Method <span style={{ background: '#f3e8ff', color: '#7e22ce', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>{orderData.paymentMethod}</span></span>
                                                <span>{orderData.paymentMethod}</span>
                                            </div>
                                            <div className="order-summary-row total">
                                                <span>Total Amount</span>
                                                <span className="total-amount">{formatCurrency(orderData.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profit Information Section */}
                                    <div className="profit-info-card" style={{ marginTop: '24px' }}>
                                        <div className="section-header" style={{ marginBottom: '16px' }}>
                                            <div className="section-title">
                                                <Wallet size={20} />
                                                <span>Profit Information</span>
                                            </div>
                                        </div>
                                        <div className="profit-details">
                                            <div className="profit-row">
                                                <span>Order Subtotal</span>
                                                <span>{formatCurrency(orderData.subtotal)}</span>
                                            </div>
                                            <div className="profit-row">
                                                <span>Platform Commission (15%)</span>
                                                <span className="profit-value negative">{formatCurrency(-(orderData.subtotal * 0.15))}</span>
                                            </div>
                                            <div className="profit-row net-income">
                                                <span>Net Income</span>
                                                <span className="profit-value positive">{formatCurrency(orderData.subtotal * 0.85)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                                    Could not load order details
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionDetail;
