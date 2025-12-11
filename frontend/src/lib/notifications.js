import { toast } from "sonner";

export const notify = {
    success(message, options = {}) {
        toast.success(message, {
            description: options.description,
            duration: options.duration ?? 3000,
            unstyled: true,
            className:
                "animate-toast-fade bg-green-800 text-white border border-green-800 shadow-lg rounded-lg px-4 py-3",
        });
    },

    warning(message, options = {}) {
        toast.warning(message, {
            description: options.description,
            duration: options.duration ?? 3000,
            unstyled: true,
            className:
                "animate-toast-fade bg-yellow-500 text-black border border-yellow-600 shadow-lg rounded-lg px-4 py-3",
        });
    },

    error(message, options = {}) {
        toast.error(message, {
            description: options.description,
            duration: options.duration ?? 3000,
            unstyled: true,
            className:
                "animate-toast-fade bg-red-800 text-white border border-red-800 shadow-lg rounded-lg px-4 py-3",
        });
    },

    info(message, options = {}) {
        toast(message, {
            description: options.description,
            duration: options.duration ?? 3000,
            unstyled: true,
            className:
                "animate-toast-fade bg-blue-600 text-white border border-blue-500 shadow-lg rounded-lg px-4 py-3",
        });
    },
};
