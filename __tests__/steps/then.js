require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
const user_exists_in_UserTable = async (id) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient();
    console.log(`looking for user [${id}] in table [${process.env.USER_TABLE}]`);
    const resp = await DynamoDB.get({
        TableName: process.env.USER_TABLE,
        Key: {
            id
        }
    }).promise();
    expect(resp.Item).toBeTruthy();
    return resp.Item;
}

const user_can_upload_image_to_url = async (url, filepath, contentType) => {
    const data = fs.readFileSync(filepath);

    await axios({
        method: 'put',
        url, 
        headers: {
            'Content-Type': contentType
        },
        data
    })
    console.log(`iamge uploaded to ${url}`);
}

const user_can_download_image_from = async (url) => {
    const response = await axios(url);
    console.log(`image downloaded from ${url}`);

    return response.data;
}

module.exports = {
    user_exists_in_UserTable,
    user_can_upload_image_to_url,
    user_can_download_image_from

}