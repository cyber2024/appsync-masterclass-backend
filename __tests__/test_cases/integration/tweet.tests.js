const given = require('../../steps/given')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance();

describe('Given an authenticated user', ()=>{
    let user;
    beforeAll(async () => {
        user = await given.an_authenticated_user();
    });
    describe('when he sends a tweet', () => {
        let tweet;
        const text = chance.string({length: 16});
        beforeAll(async () => {
            tweet = await when.we_invoke_tweet(user.username, text);
        });
        it('Saves the tweet in the tweets table', async () => {
            await then.tweet_exists_in_tweets_table(tweet.id);
        });
        it('Saves the tweet in the Timelines table', async () => {
            await then.tweet_exists_in_timelines_table(user.username, tweet.id);
        });
        it('Increments the tweetsCount in the user table by 1', async () => {
            await then.tweetsCount_is_updated_in_user_table(user.username, 1);
        });

    })
})