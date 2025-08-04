class UserResponseDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null;
    this.roleId = user.roleId;
    this.role = user.role;
    this.status = user.status;
    this.statusId = user.statusId;
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
module.exports = {
  UserResponseDTO,
};
