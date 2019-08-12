const Express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = Express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/api/v1/', routes);
appPort = process.env.PORT || 4000;

const server = app.listen(appPort, () => {
    console.log(`Service is up and running on port ${server.address().port}.`);
});