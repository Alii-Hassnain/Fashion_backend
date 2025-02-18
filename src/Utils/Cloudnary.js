const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnClouinary = async (file) => {
    try {
        if (!file) return null;
        const result = await cloudinary.uploader.upload(file, {
            // folder: 'auto',
            resource_type: "auto",
        }).catch((error) => {
            console.log("error in file : ",error);
        });
        console.log("file is uploaded on clouinary :",result.url);
        if(fs.existsSync(file)){
            fs.unlinkSync(file);
            return result;
        }
    } catch (error) {
        if(fs.existsSync(file)){
            fs.unlinkSync(file);
            console.log("error in uploading on clouinary",error);
            return null 
        }
    }
}

module.exports = { 
    uploadOnClouinary 
};