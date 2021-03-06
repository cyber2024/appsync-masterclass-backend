const given = require('../../steps/given');
const when = require('../../steps/when');

const chance = require('chance').Chance();
const path = require('path');

describe('Mutation.editMyProfile.request template', ()=>{
    it('should use "newProfile" field in expression values as \'id\'', () => {
        const templatePath = path.resolve(__dirname, '../../../mapping-templates/Mutation.editMyProfile.request.vtl');
        const username = chance.guid();
        const newProfile = {
            name: 'Russ',
            imageUrl: null,
            backgroundImageUrl: null,
            bio: "test bio",
            location: null,
            website: null,
            birthdate: null
        };
        const context = given.an_appsync_context({username}, { newProfile });
        const result = when.we_invoke_an_appsync_template(templatePath, context);

        expect(result).toEqual({
            "version" : "2018-05-29",
            "operation" : "UpdateItem",
            "key": {
                "id": {
                    S: username
                }
            },
            "update" : {
                "expression" : "set #name = :name, imageUrl = :imageUrl, backgroundImageUrl = :backgroundImageUrl, bio = :bio, #location = :location, website = :website, birthdate = :birthdate",
                "expressionNames" : {
                   "#name" : "name",
                   "#location": "location"
               },
               "expressionValues" : {
                   ":name" : {
                       S: "Russ"
                   },
                   ":imageUrl" : {
                       NULL : true
                    },
                   ":backgroundImageUrl" : {
                       NULL : true
                    },
                   ":bio" : {
                       S: "test bio"
                   },
                   ":location" : {
                       NULL : true
                    },
                   ":website" : {
                       NULL : true
                    },
                   ":birthdate" : {
                       NULL : true
                    }
               }
            },
            "condition" : {
                "expression" : "attribute_exists(id)"
            }
        })
    })
})