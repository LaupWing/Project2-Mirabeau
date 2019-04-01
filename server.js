const express = require('express');
const app = express();
const port = 3000;

app
    .use()
    .use('views', 'view')

app
    .get('/', (req,res)=>{
        res.render()
    })

app.listen(port)