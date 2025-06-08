import { Model } from "mongoose";
import MediaModel, { MediaDocument } from "./media.schema";
import UploadMedia from "../../config/uploadMedia";

/**
 * Service for handling media-related operations such as uploading and saving media files.
 */
interface CreateMediaParams {
  mediaBuffer: Buffer;
  userId: string;
}

class MediaService {
  private mediaModel: Model<MediaDocument>;
  private uploadMedia: UploadMedia;

  /**
   * Initializes the MediaService with the media model and upload utility.
   * @param mediaModel - The Mongoose model for media.
   * @param uploadMedia - The upload utility instance.
   */
  constructor(
    mediaModel: Model<MediaDocument> = MediaModel,
    uploadMedia: UploadMedia = new UploadMedia()
  ) {
    this.mediaModel = mediaModel;
    this.uploadMedia = uploadMedia;
  }

  /**
   * Uploads a media file and creates a corresponding media document in the database.
   * @param params - The parameters for creating media.
   * @param params.mediaBuffer - The buffer containing the media file data.
   * @param params.userId - The ID of the user uploading the media.
   * @returns The created MediaDocument.
   */
  async createMedia({
    mediaBuffer,
    userId,
  }: CreateMediaParams): Promise<MediaDocument> {
    try {
      const media = await this.uploadMedia.uploadFile({
        buffer: mediaBuffer,
      });
      const mediaData = {
        path: media.path,
        type: media.type,
        size: media.size,
        userId,
      };
      const mediaDocument = new this.mediaModel(mediaData);
      await mediaDocument.save();
      return mediaDocument;
    } catch (error) {
      throw new Error(
        `Failed to create media: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Retrieves a media document by its ID.
   * @param id - The ID of the media document to retrieve.
   * @returns The MediaDocument if found, or null if not found.
   */
  async getMediaById(id: string): Promise<MediaDocument | null> {
    return await this.mediaModel.findById(id).lean();
  }
}

export default MediaService;
