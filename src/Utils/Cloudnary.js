
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnClouinary = async (file) => {
    try {
        if (!file) return;
        const result = await cloudinary.uploader.upload(file, {
            folder: 'auto',
        }).catch((error) => {
            console.log(error);
        });
        fs.unlinkSync(file);
        return result;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { 
    uploadOnClouinary 
};