const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  add: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  print: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
  setup: { type: Boolean, default: false },
}, { _id: false });

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true, trim: true },
  permissions: { type: permissionSchema, default: {} }
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
