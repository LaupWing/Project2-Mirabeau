const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const api = require('./api')
const routes = require('./routes');
app
    .use(bodyParser.urlencoded({extended:true}))
    .use(bodyParser.json())
    .use(cors())
    .use(express.static("static"))
    .use('/api', api)
    .use(routes)
    .use(session({
        secret: "Mirabeau",
        cookie: {secure: false},
        resave: false,
        saveUninitialized: true
    }))
    .set('view engine', 'ejs')
    .set('views', 'view');



app.listen(port, ()=>{console.log(`Server is running on port ${port}`)})