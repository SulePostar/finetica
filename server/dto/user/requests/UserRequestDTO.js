class UserUpdateRequestDTO {
  constructor({ first_name, last_name, email }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
  }
}
class AdminUpdateUserDTO {
  constructor({ first_name, last_name, email, role_id }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.role_id = role_id;
  }
}
module.exports = {
  UserUpdateRequestDTO,
  AdminUpdateUserDTO,
};
