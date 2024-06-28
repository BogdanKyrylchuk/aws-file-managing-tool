#!/usr/bin/env node

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

// Function to list and delete objects
const listAndDeleteObjects = async () => {
  try {
    const data = await s3.listObjects(bucketParams).promise();
    const matchingFiles = data.Contents.filter(file => pattern.test(file.Key));
    
    if (matchingFiles.length === 0) {
      console.log("No matching files found.");
      return;
    }
    
    for (const file of matchingFiles) {
      try {
        await s3.deleteObject({ Bucket: bucketParams.Bucket, Key: file.Key }).promise();
        console.log(`File ${file.Key} was successfully removed.`);
      } catch (err) {
        console.error(`Error deleting file ${file.Key}:`, err);
      }
    }
  } catch (err) {
    console.error("Error listing objects:", err);
  }
};

// Execute the function
listAndDeleteObjects();
