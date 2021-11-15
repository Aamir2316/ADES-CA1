const router = require('express').Router();
const inventoriesRouter = require('./inventories');

router.use('/inventories', logRequests, inventoriesRouter);

function logRequests(req, res, next) {
    console.log(`Method: ${req.method} \t URL:${req.originalUrl}`);
    next()
};

module.exports = router;