#!/usr/bin/env node

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Ensure required environment variables are set
const { AWS_ACCESS_ID, AWS_SECRET_KEY } = process.env;
if (!AWS_ACCESS_ID || !AWS_SECRET_KEY) {
  console.error("Error: Missing AWS_ACCESS_ID or AWS_SECRET_KEY in environment variables");
  process.exit(1);
}

// Validate script arguments
if (process.argv.length < 3) {
  console.error("Error: Missing required argument for file key pattern");
  console.error("Usage: ./script.js <pattern>");
  process.exit(1);
}

// Set the region
AWS.config.update({ region: "eu-west-1" });

// Create S3 service object
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  credentials: {
    accessKeyId: AWS_ACCESS_ID,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// Create the parameters for calling listObjects
const bucketParams = {
  Bucket: "developer-task",
  Prefix: "x-wing",
};

// Get the pattern from arguments
const pattern = new RegExp(process.argv[2]);

// Call S3 to list the objects in the bucket
s3.listObjects(bucketParams, (err, data) => {
  if (err) {
    console.error("Error:", err);
    return;
  }
  data.Contents
    .filter((file) => pattern.test(file.Key))
    .forEach((file) => console.log(file.Key.slice(7)));
});
