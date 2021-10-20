const S3 = require("aws-sdk/clients/s3");
const config = require("../config.js");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require('fs')
const path = require('path');

const secretKey = config.aws_secret_access_key;
const accessKey = config.aws_access_key_id;
const region = config.aws_bucket_region;
const bucket = config.aws_bucket_name;

const s3 = new S3({
  region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

// get object from s3
function getObject (bucketParams, callback) {
  s3.getObject(bucketParams, (err, data) => {
    if (err) {
      console.log("Error", err);
      callback(err);
    } else {
      console.log("Successful Test Get");
      callback(null, data);
    }
  });
};
exports.getObject = getObject;

function uploadFile(file, title) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucket,
    Body: fileStream,
    Key: title,
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile
