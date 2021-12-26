const given = require('../../steps/given')
const when = require('../../steps/when')
const then = require('../../steps/then')
const chance = require('chance').Chance();

describe('Given an authenticated user', () => {
    jest.setTimeout(10000)
    let user;
    beforeAll(async () => {
        user = await given.an_authenticated_user();
    });
    describe('When he sends a tweet', () => {
        let tweet;
        const text = chance.string({length: 16});
        beforeAll( async () => {
            tweet = await when.a_user_calls_tweet(user, text);
        });
        it('Should return the new tweet', () => {
            expect(tweet).toMatchObject({
                text,
                replies: 0,
                likes: 0,
                retweets: 0,
            });
        }, 10000)

        describe('When a user calls getTweets', () => {
            let tweets, nextToken
            beforeAll(async () => {
                const res = await when.a_user_calls_getTweets(user, user.username, 25)
                tweets = res.tweets;
                nextToken = res.nextToken;
            })
            it('He will see the new tweet when he calls getTweets', () => {
                expect(nextToken).toBeNull();
                expect(tweets.length).toBe(1);
                expect(tweets[0]).toMatchObject(tweet);
            })
            it('He cannot ask for more than 25 tweets', async () =>{
                await expect(when.a_user_calls_getTweets(user, user.username, 26))
                .rejects
                .toMatchObject({
                    message: expect.stringContaining('Max limit is 25')
                })
            })
        })
        describe('When a user calls getMyTimeline', () => {
            let tweets, nextToken
            beforeAll(async () => {
                const res = await when.a_user_calls_getMyTimeline(user, 25)
                tweets = res.tweets;
                nextToken = res.nextToken;
            })
            it('He will see the new tweet when he calls getTweets', () => {
                expect(nextToken).toBeNull();
                expect(tweets.length).toBe(1);
                expect(tweets[0]).toMatchObject(tweet);
            })
            it('He cannot ask for more than 25 tweets', async () =>{
                await expect(when.a_user_calls_getMyTimeline(user, 26))
                .rejects
                .toMatchObject({
                    message: expect.stringContaining('Max limit is 25')
                })
            })
        })
    })
})