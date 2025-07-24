class UserResponseDTO {
  constructor(user) {
    this.id = user.id; 
    this.email = user.email;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.role_id = user.role_id;
    this.role = user.role; 
    this.is_email_verified = user.is_email_verified;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.status_id = user.status_id;
    this.status = user.user_status; 
  }
}

module.exports = {
  UserResponseDTO
};