const storage = require('../../adapters/storage');
const Promise = require('bluebird');
var request = require('request');
var sharp = require('sharp');

module.exports = {
    docName: 'images',
    crop: {
        statusCode: 201,
        permissions: false,
        query(frame) {
            if (frame.data){
                const {imgUrl , cropData: {x, y, width, height}} = frame.data;
                if (imgUrl && x != undefined && x != undefined && width != undefined && height != undefined){
                    let tempName = `cropped_${Date.now()}`;
                    let tempPath = `/tmp/${tempName}`;

                    return new Promise((resolve, reject) => {
                        var resizer = sharp()
                            .extract({left: Math.round(x), top: Math.round(y), width: Math.round(width), height: Math.round(height)})
                            .toFile(tempPath, (err, info) => {
                                if (err){
                                    console.log(`error when extracting image `, err);
                                    return reject(null);
                                } else {
                                    const store = storage.getStorage();
                                    store.save({
                                        path: tempPath,
                                        name: `${tempName}.${info.format}`
                                    })
                                        .then((croppedUrl) => {
                                            return resolve(croppedUrl);
                                        })
                                        .catch((s3Err) => {
                                            console.log(`Failed to upload cropped image to s3 `, s3Err);
                                            return reject(null);
                                        });
                                }
                            });
                        request(imgUrl).pipe(resizer);
                    });
                } else {
                    return Promise.reject(null);
                }
            } else {
                return Promise.reject(null);
            }
        }
    }
};
