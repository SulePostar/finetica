const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // basic email check
            match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },
        passwordHash: {
            type: String,
            required: true,
            select: false, // ✅ default doesn't return passwordHash
        },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        profileImage: { type: String, default: null },


        roleId: { type: Number, default: null },
        statusId: { type: Number, default: 1 },

        isEmailVerified: { type: Boolean, default: false },
        isEnabled: { type: Boolean, default: true },

        verificationToken: { type: String },
        passwordResetToken: { type: String, default: null },
        resetExpiresAt: { type: Date, default: null },
        lastLoginAt: { type: Date, default: null },
    },
    {
        timestamps: true, // createdAt / updatedAt
        strict: false // Allow additional fields not defined in schema
    }
);


UserSchema.methods.checkPassword = function (password) {

    return bcrypt.compare(password, this.passwordHash);
};

// ✅ helper to get the user data in a safe way
UserSchema.methods.toSafeJSON = function () {
    const obj = this.toObject({ versionKey: false });
    obj.id = String(obj._id);
    delete obj._id;
    delete obj.passwordHash; // just in case
    return obj;
};

module.exports = mongoose.model("User", UserSchema);
