import { Bucket, Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import { fileTypeFromBuffer } from "file-type";
import path from "path";

dotenv.config();

/**
 * Handles uploading, deleting, and streaming files to Google Cloud Storage.
 */
class UploadMedia {
  private readonly storage: Storage;
  private readonly bucket: Bucket;

  constructor() {
    const config = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: "google-cloud-key.json", // Ensure this file exists in your project root
      bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME,
    };
    if (!config.projectId || !config.keyFilename || !config.bucketName) {
      throw new Error(
        "Google Cloud Storage configuration is missing. Please check your environment variables."
      );
    }

    // we need to make path for keyFilename, it should be absolute path
    config.keyFilename = path.resolve(config.keyFilename);
    if (!path.isAbsolute(config.keyFilename)) {
      throw new Error("Key filename must be an absolute path.");
    }

    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });
    this.bucket = this.storage.bucket(config.bucketName);
  }

  /**
   * Uploads a file buffer to Google Cloud Storage.
   * @param fileData - The file data including buffer, and name.
   * @returns File metadata including path, name, size, and type.
   */
  async uploadFile(fileData: { buffer: Buffer }) {
    if (!fileData || !fileData.buffer) {
      throw new Error("File data is missing or invalid.");
    }
    const detectedType = await fileTypeFromBuffer(fileData.buffer);
    if (!detectedType) {
      throw new Error("Could not detect file type from buffer.");
    }
    // need to make name unique and also include extension
    const fileName = `file-${Date.now()}.${detectedType.ext}`;

    const file = this.bucket.file(fileName);
    await file.save(fileData.buffer, {
      contentType: detectedType.mime,
    });

    await file.makePublic();

    const fileSize = Buffer.byteLength(fileData.buffer);

    return {
      path: `${this.bucket.name}/${fileName}`,
      name: fileName,
      size: fileSize,
      type: detectedType.mime.split("/")[0],
    };
  }

  /**
   * Deletes a file from Google Cloud Storage.
   * @param filePath - The path of the file to delete.
   * @returns Success message.
   */
  async deleteFile(filePath: string) {
    if (!filePath) {
      throw new Error("File path is missing or invalid.");
    }
    const file = this.bucket.file(filePath);
    await file.delete();
    return { success: true, message: "File deleted successfully." };
  }

  /**
   * Creates a readable stream for a file in Google Cloud Storage.
   * @param filePath - The path of the file to stream.
   * @returns Readable stream.
   */
  async streamFile(filePath: string) {
    if (!filePath) {
      throw new Error("File path is missing or invalid.");
    }
    const file = this.bucket.file(filePath);
    const readStream = file.createReadStream();
    return readStream;
  }

  /**
   * Generates a public URL for a file in the bucket.
   * @param fileName - The name of the file.
   * @returns Public URL string.
   */
  getPublicUrl(fileName: string) {
    return `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
  }
}

export default UploadMedia;
