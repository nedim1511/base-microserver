import asyncHandler = require('express-async-handler');

function responseHandler(callback) {
    const handler = async (req, res, next) => {
        const result = await callback(req, res, next)
        res.locals.answer = result;
        next();
    }
    return asyncHandler(handler);
}

export = responseHandler;