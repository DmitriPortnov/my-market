const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/upload');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.jpg' || '.pnd')) {
            return cb(new Error('Please put only jpg images'));
        }
        return cb(undefined, true);
    }
});
const upload = multer({
    storage: storage
});

module.exports = upload;