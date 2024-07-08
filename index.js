const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const _ = require('lodash');
const compression = require('compression')

// based on: https://attacomsian.com/blog/uploading-files-nodejs-express

const port = process.env.PORT || 4000;
const uploadDirectory = process.env.UPLOAD_DIRECTORY || "./uploads/";

const app = express();

app.use(compression())
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// upload a single file stored in the form-data variable 'data'
app.post('/fileupload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            // form-data key 'data'
            const file = req.files.data;
            file.mv(uploadDirectory + file.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () =>
    //! \todo synchronise call, only run in debug mode
    console.log(`App is listening on port ${port}.`)
);