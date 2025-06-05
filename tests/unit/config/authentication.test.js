/* Mock the env first */
process.env.SECRET_KEY = 'test_secret_key';
process.env.SECRET_EXPIRATION = '1h';
const { generateToken, validateToken } = require("../../../src/config/authentication");

const jwt = require("jsonwebtoken");



/* Take in a string and a test function */
describe("Authentication Config", () => {

    const testUser = {

        id: 4,
        username: "test",
        email: "test@gmail.com"


    }



    describe("Generate User Token", () => {

        test("run generateToken function", () => {

            /* use to Be , toEqual for deep comparison, toMatchObject partial deep comparison */
            /* create a json web token and compare the value */
            const functionToken = generateToken(testUser);
            expect(jwt.verify(functionToken, process.env.SECRET_KEY)).toEqual({

                id: testUser.id,
                name: testUser.username,
                email: testUser.email,
                iat: expect.any(Number),
                exp: expect.any(Number)



            });



        })




    })

    describe("Validate User Token function", () => {

        /* Validate function should return decoded if match, and throw error if not match */

        /* for valid */
        test("valid token", () => {

            const testToken = jwt.sign(testUser, process.env.SECRET_KEY , { expiresIn: process.env.SECRET_EXPIRATION})

            /* decoded token should match that of the current user */
            const result = validateToken(testToken)
            expect(result).toMatchObject(

                {

                    id: 4,
                    username: "test",
                    email: "test@gmail.com"
            
            
                }

            )




        })


        test("invalid token", () => {
            const testToken = jwt.sign(testUser, process.env.SECRET_KEY , { expiresIn: process.env.SECRET_EXPIRATION})

            const invalidToken = testToken + "bad";

            expect(() => {validateToken(invalidToken)}).toThrow()

            


        })

    })



})