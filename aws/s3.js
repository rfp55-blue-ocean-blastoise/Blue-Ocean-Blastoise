const S3 = require("aws-sdk/clients/s3");
const config = require("../config.js");
const multer = require('multer');
const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');

const secretKey = config.aws_secret_access_key;
const accessKey = config.aws_access_key_id;
const region = config.aws_bucket_region;
const bucket = config.aws_bucket_name;

const s3 = new S3({
  region,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

// const bucketParams = {
//   Key: "accessible_epub_3 (1).epub",
//   Bucket: bucket,
// };

// get obect from s3
const getObject = (bucketParams, callback) => {
  s3.getObject(bucketParams, (err, data) => {
    if (err) {
      console.log("Error", err);
      callback(err)
    } else {
      console.log("Successful Test Get");
      callback(null, data)
    }
  });
}
//upload object to s3
const upload = multer({
    storage: multerS3({
      s3,
      bucket,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        console.log({file}, ' metadata500')
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb){
        console.log({file})
        cb(null, `epub-${Date.now().toString()}`);
      }
    })
  })


const uploadObject = () => {
  s3.upload.single('epub')
  next()
};

// app.post('/upload', upload.array('photos', 3), function(req, res, next) {
//   res.send('Successfully uploaded ' + req.files.length + ' files!')
// })


module.exports = {
  upload,
  getObject,
};
