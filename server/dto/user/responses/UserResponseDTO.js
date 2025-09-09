class UserResponseDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.fullName = `${user.firstName} ${user.lastName}`;
    this.profileImage = user.profileImage;
    this.roleId = user.roleId;
    this.roleName = user.role?.get('role');
    this.statusId = user.statusId;
    this.statusName = user.status?.get('status');
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.lastLoginAt = user.lastLoginAt;
  }
}
module.exports = {
  UserResponseDTO,
};
