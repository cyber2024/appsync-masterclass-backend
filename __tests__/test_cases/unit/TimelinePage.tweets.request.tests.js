const given = require('../../steps/given');
const when = require('../../steps/when');

const chance = require('chance').Chance();
const path = require('path');

describe('TimelinePage.tweets.request template', ()=>{
    it('should return empty array if there are no tweets', () => {
        const templatePath = path.resolve(__dirname, '../../../mapping-templates/TimelinePage.tweets.request.vtl');
        const username = chance.guid();
        const context = given.an_appsync_context({username}, {}, {}, {tweets: []});
        result =  when.we_invoke_an_appsync_template(templatePath, context);
        
        expect(result).toEqual([]);
    })
    it('should return a template if tweets exist', () => {
        const templatePath = path.resolve(__dirname, '../../../mapping-templates/TimelinePage.tweets.request.vtl');
        const username = chance.guid();
        const tweetId = chance.guid();
        const tweets = [{tweetId, userId: username}];
        const context = given.an_appsync_context({username}, {}, {}, {tweets});
        result =  when.we_invoke_an_appsync_template(templatePath, context);
        expect(result).toEqual({
            "version" : "2018-05-29",
            "operation" : "BatchGetItem",
            "tables" : {
                "${TweetsTable}": {
                   "keys": [{
                       "id": {"S": tweetId}
                    }],
                    "consistentRead": false
                }
            }
        } );
    })
})