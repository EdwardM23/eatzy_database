import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function uploadToCloudinary(locaFilePath, folderName) {
  return cloudinary.uploader
    .upload(locaFilePath, { folder: folderName })
    .then((result) => {
      fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

export async function uploadDocToCloudinary(localFilePath, folderName) {
  return cloudinary.uploader.upload(
    localFilePath,
    { folder: folderName },
    function (error, result) {
      console.log(result, error);
    }
  );
}
