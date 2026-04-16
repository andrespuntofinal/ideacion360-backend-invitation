const cloudinary = require('cloudinary').v2;

// The CLOUDINARY_URL environment variable is automatically read by the SDK.
cloudinary.config({
  secure: true
});

module.exports = cloudinary;
