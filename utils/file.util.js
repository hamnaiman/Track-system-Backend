const fs = require("fs");
const path = require("path");

const saveFileLocally = (buffer, fileName) => {
  const dir = path.join(__dirname, "..", "uploads", "system");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = { saveFileLocally, deleteFile };
