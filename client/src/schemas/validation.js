import { z } from 'zod';
import { useState, useCallback } from 'react';


export const validateFormData = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formErrors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        formErrors[path] = err.message;
      });

      return {
        success: false,
        data: null,
        errors: formErrors,
      };
    }

    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' },
    };
  }
};


export const validateSingleField = (schema, fieldName, value) => {
  try {
    const testData = { [fieldName]: value };
    schema.pick({ [fieldName]: true }).parse(testData);

    return {
      isValid: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }

    return {
      isValid: false,
      error: 'Validation failed',
    };
  }
};


export const useFormValidation = (schema, initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = useCallback(() => {
    const result = validateFormData(schema, data);
    if (!result.success) {
      setErrors(result.errors);
    } else {
      setErrors({});
    }
    return result.success;
  }, [schema, data]);

  const validateField = useCallback(
    (fieldName, value) => {
      const result = validateSingleField(schema, fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: result.error,
      }));
      return result.isValid;
    },
    [schema]
  );

  const handleChange = useCallback(
    (fieldName, value) => {
      setData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (fieldName) => {
      setTouched((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      validateField(fieldName, data[fieldName]);
    },
    [data, validateField]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    setData,
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};

export const commonPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const isEmail = (email) => commonPatterns.email.test(email);
export const isStrongPassword = (password) => commonPatterns.strongPassword.test(password);
export const isPhoneNumber = (phone) => commonPatterns.phone.test(phone);
