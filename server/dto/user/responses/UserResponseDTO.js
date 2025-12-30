class UserResponseDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = `${user.firstName} ${user.lastName}`;
    this.profileImage = user.profileImage;
    this.isEnabled = user.isEnabled;
    this.roleId = user.roleId;
    this.roleName = user.role ? user.role.role : null;
    this.statusId = user.statusId;
    this.statusName = user.status ? user.status.status : null;
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.lastLoginAt = user.lastLoginAt;
  }
}
module.exports = {
  UserResponseDTO,
};
