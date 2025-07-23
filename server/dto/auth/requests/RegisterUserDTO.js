class RegisterUserDTO {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.role_id = null;
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Please provide a valid email address');
    }

    if (!this.password) {
      errors.push('Password is required');
    } else if (this.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!this.first_name) {
      errors.push('First name is required');
    } else if (this.first_name.trim().length < 2) {
      errors.push('First name must be at least 2 characters long');
    }

    if (!this.last_name) {
      errors.push('Last name is required');
    } else if (this.last_name.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toModelData() {
    return {
      email: this.email.toLowerCase().trim(),
      password_hash: this.password, 
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      role_id: this.role_id,
    };
  }
}

module.exports = RegisterUserDTO;
