const rawFileUploadS3UploadBucket = 'yu-lab-raw-file-upload';
const bucketRegion = 'us-west-2';
const IdentityPoolId = 'us-west-2:f4276906-7876-496b-b1b0-e6d22577128d';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {Bucket: rawFileUploadS3UploadBucket}
});

function uploadFile() {

  console.log("uploadFile invoked");

  let file = document.getElementById("uploadedFile").files[0];
  let formData = new FormData();

  formData.append("file", file);
  console.log("got file: " + file);

  const fileName = file.name;
  const fileKey = encodeURIComponent(fileName) + "/";

  console.log("FileKey: " + fileKey);

  // Use S3 ManagedUpload class as it supports multipart uploads
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: rawFileUploadS3UploadBucket,
      Key: fileKey,
      Body: file,
    }
  });

  const promise = upload.promise();

  promise.then(
    function(data) {
      console.log("Successfully uploaded file.");
    },
    function(err) {
      console.log("There was an error uploading your file: ", err.message);
    }
  );
}
