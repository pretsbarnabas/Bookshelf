import fs from "fs"
import path from "path"

export class ImageController{
    static uploadImage(req:any,res:any){
        const { imageData, imageName } = req.body;

        if (!imageData || !imageName) {
          return res.status(400).json({ message: 'Base64 image or image name missing' });
        }
        
        
        
        // Strip out the base64 prefix (if present)
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        
        // Convert base64 string to a buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // Define the path where you want to store the image
        const imagePath = path.join(__dirname, "../../images",imageName)

         // Ensure the images directory exists
         fs.mkdirSync(path.join(__dirname, '../../images'), { recursive: true });

         // Write the image to the filesystem
         fs.writeFile(imagePath, imageBuffer, (err) => {
           if (err) {
             return res.status(500).json({ message: 'Failed to save image', error: err });
           }
           res.status(200).json({ message: 'Image saved successfully', imagePath });
         });
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
}