import fs from "fs"
import path from "path"
import * as validators from "../tools/validators"
import { Logger } from "../tools/logger";

export class ImageController{

    static currentUrl = "https://bookshelf.koyeb.app/api"


    static uploadImage(req:any, res:any) {
        const { imageData, imageName } = req.body;
    
        if (!imageData || !imageName) {
            return res.status(400).json({ message: 'Base64 image or image name missing' });
        }
    
        // Extract the extension from the Base64 string
        const match = imageData.match(/^data:image\/(\w+);base64,/);
        if (!match) {
            res.status(400).json({ message: 'Invalid image format' });
            return false
        }
        const extension = match[1];

        if (extension.toLowerCase() === 'svg') {
            res.status(400).json({ message: 'SVG format is not supported' });
            return false
        }
    
        // Ensure the imageName has the correct extension
        const finalImageName = imageName.includes('.') ? imageName : `${imageName}.${extension}`;
    
        // Strip out the base64 prefix
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
        if (!validators.isValidBase64(base64Data)) {
            Logger.info(`Invalid base64 data sent: ${base64Data}`);
            res.status(400).json({ message: 'Image data incorrect' });
            return false
        }
    
        // Convert base64 string to a buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
    
        // Define the path where you want to store the image
        const imagePath = path.join(__dirname, '../../images', finalImageName);
    
        // Ensure the images directory exists
        fs.mkdirSync(path.join(__dirname, '../../images'), { recursive: true });
    
        // Write the image to the filesystem
        fs.writeFile(imagePath, imageBuffer, (err) => {
            if (err) {
                res.status(500).json({ message: 'Failed to save image', error: err });
                return false
            }
        });
        Logger.info(`New image created: ${finalImageName}`)
        return finalImageName
    }

    

    static getImage(req:any,res:any){
        try {
            const {imageName} = req.params
            const imagePath = path.join(__dirname, "../../images",imageName)

            return res.sendFile(imagePath,(err:any)=>{
                if(err){
                    res.status(404).send("Image not found")
                }
            })

        } catch (error) {
            return res.status(500).json({ message: error });
        }
    }


    static deleteImage(imageName: string) {
        try {
            if (!imageName) {
                Logger.warn("Image name is required when deleting")
            }
    
            const imagePath = path.join(__dirname, "../../images", imageName);
    
            if (!fs.existsSync(imagePath)) {
                Logger.warn(`File not found: ${imagePath}`)
            }
    
            fs.unlinkSync(imagePath);
            Logger.info(`Deleted image: ${imageName}`);
        } catch (error) {
            Logger.error(`Error deleting image: ${JSON.stringify(error)}`);
        }
    }
}