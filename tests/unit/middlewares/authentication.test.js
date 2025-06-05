// tests/unit/middleware/authenticate.test.js
const { authenticate } = require('../../../src/middlewares/authentication');
const { validateToken } = require("../../../src/config/authentication");

// Mock the validateToken function
jest.mock('../../../src/config/authentication', () => ({
  validateToken: jest.fn()
}));

describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;
/* Define set up code */
  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  test('should call next() when token is valid', () => {
    // TODO: 1. Set up a mock authorization header with a valid format
    mockReq.headers = { "authorization" : "Bearer token" };
    // TODO: 2. Mock validateToken to return a user object
    validateToken.mockReturnValue({id: 3, name:"test", email:"test@email.com"});
    // TODO: 3. Call the authenticate middleware
    authenticate(mockReq, mockRes, mockNext);
    // TODO: 4. Assert validateToken was called with the correct token
    expect(validateToken).toHaveBeenCalledWith("token");
    // TODO: 5. Assert req.user was set to the mock user
    expect(mockReq.user).toMatchObject({id: 3, name:"test", email:"test@email.com"});
    // TODO: 6. Assert next() was called exactly once
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});