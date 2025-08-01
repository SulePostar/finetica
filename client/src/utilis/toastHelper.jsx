// Helper for showing toast notifications using react-toastify.

import { toast } from 'react-toastify';

const notify = {
  onSuccess: (message, options = {}) => toast.success(message, { autoClose: 3000, ...options }),

  onError: (message, options = {}) => toast.error(message, { autoClose: 5000, ...options }),

  onInfo: (message, options = {}) => toast.info(message, { autoClose: 3000, ...options }),

  onWarning: (message, options = {}) => toast.warn(message, { autoClose: 3000, ...options }),

  custom: (message, options = {}) => toast(message, { autoClose: 3000, ...options }),
};

export default notify;
