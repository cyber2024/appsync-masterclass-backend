require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');

const { TWEETS_TABLE, TIMELINE_TABLE, USER_TABLE } = process.env;

const user_exists_in_UserTable = async (id) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient();
    console.log(`looking for user [${id}] in table [${USER_TABLE}]`);
    const resp = await DynamoDB.get({
        TableName: USER_TABLE,
        Key: {
            id
        }
    }).promise();
    expect(resp.Item).toBeTruthy();
    return resp.Item;
}
const tweetsCount_is_updated_in_user_table = async (id, newCount) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient();
    console.log(`looking for user [${id}] in table [${USER_TABLE}]`);
    const resp = await DynamoDB.get({
        TableName: USER_TABLE,
        Key: {
            id
        }
    }).promise();
    expect(resp.Item).toBeTruthy();
    expect(resp.Item.tweetsCount).toBe(newCount);
    return resp.Item;
}
const tweet_exists_in_tweets_table = async (id) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient();
    console.log(`looking for tweet [${id}] in table [${TWEETS_TABLE}]`);
    const resp = await DynamoDB.get({
        TableName: TWEETS_TABLE,
        Key: {
            id
        }
    }).promise();
    expect(resp.Item).toBeTruthy();
    return resp.Item;
}
const tweet_exists_in_timelines_table = async (userId, tweetId) => {
    const DynamoDB = new AWS.DynamoDB.DocumentClient();
    console.log(`looking for tweet [${tweetId}] for user [${userId}] in table [${TIMELINE_TABLE}]`);
    const resp = await DynamoDB.get({
        TableName: TIMELINE_TABLE,
        Key: {
            userId,
            tweetId
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
    console.log(`iamge uploaded to url`);
}

const user_can_download_image_from = async (url) => {
    const response = await axios(url);
    console.log(`image downloaded from ${url}`);

    return response.data;
}

module.exports = {
    user_exists_in_UserTable,
    user_can_upload_image_to_url,
    user_can_download_image_from,
    tweet_exists_in_tweets_table,
    tweet_exists_in_timelines_table,
    tweetsCount_is_updated_in_user_table

}