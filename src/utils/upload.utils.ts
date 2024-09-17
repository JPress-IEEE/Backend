import multer from 'multer';
import path from 'path';

const profilePicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pics/');
    },
    filename: (req, file, cb) => {
        const filename = `profile-pic-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});

const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
        const filename = `resume-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});
const profilePicUpload = multer({
    storage: profilePicStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = allowedTypes.test(file.mimetype);

        if (mimeType && allowedTypes.test(ext)) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed.'));
    },
    limits: { fileSize: 1024 * 1024 * 5 } 
});

const resumeUpload = multer({
    storage: resumeStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = allowedTypes.test(file.mimetype);

        if (mimeType && allowedTypes.test(ext)) {
            return cb(null, true);
        }
        cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    },
    limits: { fileSize: 1024 * 1024 * 10 } 
});

export { profilePicUpload, resumeUpload };
