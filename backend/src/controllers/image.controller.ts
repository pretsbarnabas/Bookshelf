import {v2 as cloudinary} from "cloudinary"

export class ImageController{

    static setup(){
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
    }


    static async uploadToCloudinary(base64Data: string) {
        try {
          // Validate base64 format
          if (!base64Data.startsWith('data:image/')) {
            throw new Error('Invalid base64 image format');
          }
      
          // Extract MIME type and data
          const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
          }
      
          const mimeType = matches[1];
          const imageBuffer = Buffer.from(matches[2], 'base64');
      
          // Validate allowed types
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.some(type => mimeType.includes(type))) {
            throw new Error('Only JPEG/PNG/GIF images allowed');
          }
      
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(
            `data:${mimeType};base64,${imageBuffer.toString('base64')}`, 
            { folder: "images" }
          );
      
          return result.secure_url;
        } catch (error) {
          throw error; // Re-throw for controller handling
        }
      }

      static async deleteCloudinaryImage(imageUrl: string): Promise<boolean> {
        try {
          // Extract public ID from Cloudinary URL
          const publicId = ImageController.extractPublicIdFromUrl(imageUrl);
          
          if (!publicId) {
            throw new Error('Invalid Cloudinary URL');
          }
      
          const result = await cloudinary.uploader.destroy(publicId);
          
          return result.result === 'ok';
        } catch (error) {
          console.error('Error deleting image:', error);
          return false;
        }
      }
      
      static extractPublicIdFromUrl(url: string): string | null {
        const regex = /upload\/(?:v\d+\/)?(.+?)(?:\..+)?$/;
        const match = url.match(regex);
        return match ? match[1] : null;
      }
}