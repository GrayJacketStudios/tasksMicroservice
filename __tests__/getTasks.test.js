import 'regenerator-runtime/runtime'
const { expect, it } = require("@jest/globals");
const { handler } = require("../src/handlers/getTasks");

const body = [{
    id: '1',
    title: 'Test',
    description: 'Test',
    createdAt: '2022-03-06T20:35:58.112Z'
},
{
    id: '2',
    title: 'Test',
    description: 'Test',
    createdAt: '2022-03-06T20:35:58.112Z'
}];

jest.mock('aws-sdk', () => {
    return {
        DynamoDB: { // just an object, not a function
            DocumentClient: jest.fn(() => {
                return {
                    scan: jest.fn(() => {
                        return {
                            promise: jest.fn(() => {return {Items: body}})
                        }
                    })
                }
            })
        }
    }
});

describe('Check if the function tries to retrieve the data from the database', () => {
    it("Check if it returns 200", async () => {
        const response = await handler({}, {});
        expect(response.statusCode).toBe(200);
    });

    it("It should return some data, and only call the mock once", async () => {
        const response = await handler({}, {});
        expect(JSON.parse(response.body)).toEqual(body);
    });
});
