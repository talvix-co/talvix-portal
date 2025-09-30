import { useNotificationContext } from "../contexts/NotificationContext";

export const useNotification = () => {
  const { showNotification } = useNotificationContext();

  const showSuccess = (message: string, duration?: number) => {
    showNotification(message, "success", duration);
  };

  const showError = (message: string, duration?: number) => {
    showNotification(message, "error", duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showNotification(message, "warning", duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification(message, "info", duration);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};