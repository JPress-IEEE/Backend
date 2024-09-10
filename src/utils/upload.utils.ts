import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pics/'); 
    },
    filename: (req, file, cb) => {
        const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        const filePath = filename.replace(/\\/g, '/');
        cb(null, filePath);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/; 
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = allowedTypes.test(file.mimetype);

        if (mimeType && allowedTypes.test(ext)) {
            return cb(null, true); 
        }
        cb(new Error('Only images are allowed')); 
    },
    limits: { fileSize: 1024 * 1024 * 5 } 
});

export default upload;
