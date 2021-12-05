const S3 = require('aws-sdk/clients/s3');
const s3 = new S3({useAccelerateEndpoint: true});
const ulid = require('ulid');

const { BUCKET_NAME } = process.env;

module.exports.handler = async (event) => {
    const id = ulid.ulid();
    let key = `${event.identity.username}/${id}`;

    const extension = event.arguments.extension
    if(extension){
        if(extension.startsWith('.')){
            key += extension;
        } else {
            key += `.${extension}`;
        }
    }
    const contentType = event.arguments.contentType || 'image/jpeg';
    if(!contentType.startsWith('image/')){
        throw new Error('content type must be an image.');
    }
    // const params = {
    //     Bucket: BUCKET_NAME,
    //     Fields: {
    //         key: key,
    //     },
    //     ACL: 'public-read',
    //     ContentType: contentType
    // }
    // return new Promise( async (resolve, reject)=>{
    //     s3.createPresignedPost(params, (err, data) => {
    //         if (err) {
    //             console.log('Presigning post data encountered error', err);
    //             return reject('');
    //         }
    //         console.log('The post data is', data);
    //         return resolve(data.url);
    //     });
    // });
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        ACL: 'public-read',
        ContentType: contentType
    }

    const signedUrl = s3.getSignedUrl('putObject', params);

    return signedUrl;
}