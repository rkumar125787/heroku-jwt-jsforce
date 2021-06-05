const express = require('express');
const jsforce = require('jsforce');
const compression = require('compression');
const helmet = require('helmet');
const { getToken } = require('sf-jwt-token');

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();
app.use(helmet);
app.use(compression);

const conn = jsforce.Connection();

app.get('/', async (req, res) => {

})

app.listen(PORT, () => {
    try {
        const jwtTokenresponse = await getToken({
            iss: process.env.CLIENT_ID,
            sub: process.env.USERNAME,
            aud: process.env.LOGIN_URL,
            privateKey: process.env.PRIVATE_KEY
        })
        conn.initialize({
            instanceUrl: jwtTokenresponse.instance_url,
            accessToken: jwtTokenresponse.access_token

        })
        const accounts = await conn.query('select Id,Name from account');
        res.json(accounts);
    }
    catch (e) {
        console.log(e);
        res.json(JSON.stringify(e))
    }
    console.log('Server Started on' + HOST + 'on port ' + PORT);
})
