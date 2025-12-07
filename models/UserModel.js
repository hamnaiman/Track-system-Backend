const mongoose = require("mongoose");
const validator = require("validator");

// Permission override schema (NO automatic _id)
const permissionsSchema = new mongoose.Schema(
  {
    add: { type: Boolean, default: null },
    edit: { type: Boolean, default: null },
    delete: { type: Boolean, default: null },
    print: { type: Boolean, default: null },
    view: { type: Boolean, default: null },
    setup: { type: Boolean, default: null }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    customerCode: { type: String, required: true, trim: true, index: true },
    userId: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || validator.isEmail(v),
        message: "Invalid email"
      }
    },

    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },

    password: { type: String, required: true },

    isActive: { type: Boolean, default: true },

    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },

    permissionsOverride: {
      type: permissionsSchema,
      default: {}
    },

    /* ✅ ✅ FORGOT PASSWORD + OTP SECURITY FIELDS (NEW) */
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    otpCode: { type: String },
    otpExpire: { type: Date },
    otpVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Unique userId per customer
userSchema.index({ customerCode: 1, userId: 1 }, { unique: true });

// Lock check
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Permission merge
userSchema.methods.getEffectivePermissions = function (rolePermissions = {}) {
  const overrides = this.permissionsOverride || {};
  const merged = { ...rolePermissions };

  Object.keys(overrides).forEach((key) => {
    if (overrides[key] === true || overrides[key] === false) {
      merged[key] = overrides[key];
    }
  });

  return merged;
};

module.exports = mongoose.model("User", userSchema);
