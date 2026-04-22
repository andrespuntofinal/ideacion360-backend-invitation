import cloudinaryLib from 'cloudinary';

const cloudinary = cloudinaryLib.v2;

// CLOUDINARY_URL environment variable is automatically read by the SDK.
cloudinary.config({ secure: true });

export default cloudinary;
