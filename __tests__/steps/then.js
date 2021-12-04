require('dotenv').config();
const AWS = require('aws-sdk');

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

module.exports = {
    user_exists_in_UserTable
}