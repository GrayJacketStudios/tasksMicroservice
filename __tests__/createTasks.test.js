const { expect, it } = require("@jest/globals");
const { handler } = require("../src/handlers/createTask");

describe("Check what happens if it receives incorrect data", () => {
    it("Send and empty body, it should return 400 status code", async () => {
        const response = await handler({body: '{}'}, {});
        expect(response.statusCode).toBe(400);
    });

    it("Send a body without the needed parameters", async () => {
        const body = JSON.stringify({
            title: 'Test',
            description: 'Test'
        })
        const response = await handler({body}, {});
        expect(response.statusCode).toBe(400);
    });
});

describe("Check what happens if it receives correct data", () => {
    it("Send a body with all the needed parameters", async () => {
        const body = JSON.stringify({
            title: 'Test',
            description: 'Test',
            dueDate: '2020-01-01',
            priority: 'low',
            status: 'todo',
            userId: '1'
        });
        const response = await handler({body}, {});
        expect(response.statusCode).toBe(201);    
    });
});

