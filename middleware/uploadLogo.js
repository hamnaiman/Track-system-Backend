const upload = require("./upload");

// Logo-specific upload
// - Uses memory buffer
// - Field name remains "logo"
// - Controller handles sharp & dimension validation
module.exports = upload.single("logo");
