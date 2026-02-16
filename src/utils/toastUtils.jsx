import { toast } from "react-toastify";
import ToastNotification from "../components/shared/notifications/ToastNotification";

export const showToast = {
    success: (message, title = "Thành công") => {
        toast(<ToastNotification title={title} message={message} type="success" />, {
            style: { padding: 0, background: 'transparent', boxShadow: 'none' },
            bodyStyle: { margin: 0 },
            icon: false, // Disable default icon
            closeButton: false, // We use our own
            autoClose: 3000,
        });
    },
    error: (message, title = "Lỗi") => {
        toast(<ToastNotification title={title} message={message} type="error" />, {
            style: { padding: 0, background: 'transparent', boxShadow: 'none' },
            bodyStyle: { margin: 0 },
            icon: false,
            closeButton: false,
            autoClose: 3000,
        });
    },
    info: (message, title = "Thông báo") => {
        toast(<ToastNotification title={title} message={message} type="info" />, {
            style: { padding: 0, background: 'transparent', boxShadow: 'none' },
            bodyStyle: { margin: 0 },
            icon: false,
            closeButton: false,
            autoClose: 3000,
        });
    }
};

export default showToast;
