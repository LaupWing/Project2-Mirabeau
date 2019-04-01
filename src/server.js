const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes')

app
    .use(bodyParser.urlencoded({extended:true}))
    .use(bodyParser.json())
    .use(express.static("static"))
    .use(routes)
    .use(session({
        secret: "Mirabeau",
        cookie: {secure: false},
        resave: false,
        saveUninitialized: true
    }))
    .set('view engine', 'ejs')
    .set('views', 'view');

// app
//     .get('/', (req,res)=>{
//         res.render('index')
//     })

app.listen(port, ()=>{console.log(`Server is running on port ${port}`)})