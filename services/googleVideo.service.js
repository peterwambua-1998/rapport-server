const videoIntelligence = require("@google-cloud/video-intelligence").v1;

// Initialize the client
const videoClient = new videoIntelligence.VideoIntelligenceServiceClient();

const analyzeVideo = async (filePath) => {
  try {
    const request = {
      inputUri: filePath, // Assuming video is uploaded to a GCS bucket
      features: ["LABEL_DETECTION", "OBJECT_TRACKING"],
    };

    // Start video annotation
    const [operation] = await videoClient.annotateVideo(request);
    console.log("Processing video for analysis...");

    // Wait for operation to complete
    const [result] = await operation.promise();

    // Parse the results
    const labels = result.annotationResults[0].segmentLabelAnnotations.map(
      (label) => label.entity.description
    );
    const objects = result.annotationResults[0].objectAnnotations.map(
      (object) => object.entity.description
    );

    return {
      tags: labels,
      tools: objects,
    };
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw new Error("Video analysis failed.");
  }
};

module.exports = analyzeVideo;
