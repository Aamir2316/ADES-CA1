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
    database.connect()
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