import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const theme: ToasterProps["theme"] = "system";

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-right"
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-slate-400 group-[.toast]:hover:text-slate-600 group-[.toast]:hover:bg-slate-50 group-[.toast]:w-3 group-[.toast]:h-3 group-[.toast]:rounded-full group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:text-xs group-[.toast]:transition-colors group-[.toast]:opacity-70 group-[.toast]:hover:opacity-100 group-[.toast]:border-0 group-[.toast]:shadow-none group-[.toast]:ml-auto group-[.toast]:mr-1 group-[.toast]:mt-1",
        },
        style: {
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          paddingRight: '24px',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
