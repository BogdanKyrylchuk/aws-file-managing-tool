#!/usr/bin/env node

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
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
  console.error("Error: Missing required argument for file path");
  console.error("Usage: ./script.js <file-path>");
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

// Configure the upload parameters
const uploadParams = { Bucket: "developer-task", Key: "", Body: "" };
const filePath = process.argv[2];

// Configure the file stream and obtain the upload parameters
const fileStream = fs.createReadStream(filePath);

fileStream.on("error", (err) => {
  console.error("File Error:", err);
});

uploadParams.Body = fileStream;
uploadParams.Key = `x-wing/${path.basename(filePath)}`;

// Call S3 to upload the file to the specified bucket
s3.upload(uploadParams, (err, data) => {
  if (err) {
    console.error("Error:", err);
    return;
  }
  console.log("Upload Successful. Link for downloading:", data.Location);
});
