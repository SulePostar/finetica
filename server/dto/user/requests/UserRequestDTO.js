class UserUpdateRequestDTO {
    constructor({ first_name, last_name, email}) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
    }
  }
  
class AdminUpdateUserDTO {
    constructor({ first_name, last_name, email, role_id, status_id }) {
      this.first_name = first_name;
      this.last_name = last_name;
      this.email = email;
      this.role_id = role_id;
      this.status_id = status_id;
    }
  }

module.exports = {
  UserUpdateRequestDTO,
  AdminUpdateUserDTO
};