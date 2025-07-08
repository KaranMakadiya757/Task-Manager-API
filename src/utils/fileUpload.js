import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

async function fileUpload(path) {
    try {
        if (!path) return null;

        const res = await cloudinary.uploader.upload(path, { resource_type: "auto" });
        fs.unlinkSync(path)
        return res;
    } catch (error) {
        fs.unlinkSync(path)
        return null;
    }
}

export { fileUpload }