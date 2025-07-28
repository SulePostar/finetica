class LoginUserDTO {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
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

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = LoginUserDTO;
