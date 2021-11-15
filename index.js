const express = require('express');
const app = express();
const path = require('path');
const apiRouter = require('./routers/api');
const database = require('./database/database');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);

const port = process.env.PORT || 8080;

app.post('/connect', function (req, res, next) {
    // const connectionString = req.body.connectionString;
    let queryString =
        `
    CREATE TABLE IF NOT EXISTS HW2_inventories (
        id SERIAL primary key,
        itemName VARCHAR unique not null,
        itemQuantity INT not null
        );
        `;
    database.connect()
        .then(() => {
            return database.queryPromise(queryString)
        })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch(error => {
            return next(error);
        })

});


app.listen(port, () => {
    console.log('App listening on port: ' + port);
})