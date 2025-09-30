import { Toaster } from "sonner";

export const NotificationSnackbar = () => {
  return (
    <Toaster
      position="bottom-right"
      closeButton
      richColors
      duration={5000}
      className="toaster group"
      toastOptions={{
        className: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        descriptionClassName: "group-[.toast]:text-muted-foreground",
      }}
    />
  );
};