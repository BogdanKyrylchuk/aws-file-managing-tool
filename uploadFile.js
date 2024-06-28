#!/usr/bin/env node

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

// Load of env onfig
require("dotenv").config();

// Set the region
AWS.config.update({ region: "eu-west-1" });

// Create S3 service object
s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// call S3 to retrieve upload file to specified bucket
var uploadParams = { Bucket: "developer-task", Key: "", Body: "" };
var file = process.argv[2];

// Configure the file stream and obtain the upload parameters
var fs = require("fs");
var fileStream = fs.createReadStream(file);

fileStream.on("error", function (err) {
  console.log("File Error: ", err);
});

uploadParams.Body = fileStream;

var path = require("path");

uploadParams.Key = "x-wing/" + path.basename(file);

// call S3 to retrieve upload file to specified bucket
s3.upload(uploadParams, function (err, data) {
  if (err) {
    console.log("Error: ", err);
  }
  if (data) {
    console.log("Upload Successfull. Link for downloading:", data.Location);
  }
});
