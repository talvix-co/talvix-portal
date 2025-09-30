import { createContext, useContext, type ReactNode } from "react";
import { toast } from "sonner";

export type NotificationSeverity = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (
    message: string,
    severity: NotificationSeverity,
    duration?: number,
  ) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const showNotification = (
    message: string,
    severity: NotificationSeverity,
    duration = 5000,
  ) => {
    const options = {
      duration,
    };

    switch (severity) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "info":
      default:
        toast.info(message, options);
        break;
    }
  };

  const hideNotification = () => {
    toast.dismiss();
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
};