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

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket: "developer-task",
  Prefix: "x-wing",
};

// Call S3 to list the buckets
s3.listObjects(bucketParams, function (err, data) {
  if (err) {
    console.log("Error: ", err);
  } else {
    data.Contents.filter((file) => file.Key.match(process.argv[2])).forEach(file => console.log(file.Key.slice(7, file.Key.length)));
  }
});
