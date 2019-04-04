const express = require('express');
const mongodb = require('mongodb');
const axios = require('axios');
const router = express.Router();
const apiUrl = 'http://localhost:3001/api'
const {getData} = require('./data');

console.log(getData('https://pokeapi.co/api/v2/'))
// Omdat ik in de routes.js heb aangegeven dat deze router een get request is naar /api
// word slash hier gerefeerd naar /api
router.get('/', async (req,res)=>{
    console.log('api call')
    const posts = await loadPostCollection();
    // De find method zoekt in de database naar een specifieke data. Door een lege object erin te houden word alles gepakt in de dataset
    res.send(await posts.find({}).toArray());
})

router.post('/', async (req,res)=>{
    const posts = await loadPostCollection();
    await posts.insertOne({
        test: 'Test in de api4'
    });
})

function getDataFromMongoDB(){
    return new Promise(async (resolve, reject)=>{
        try{
            const res = await axios.get(apiUrl)
            const data = res.data;
            console.log(data)
        }
        catch(err){

        }
    })
}

getDataFromMongoDB()

// axios.post(apiUrl)
//     .then(response=>{console.log('response')})
//     .catch(err=>{console.log('yay')})

// Functie om een connectie te maken met de post collectie
async function loadPostCollection(){
    const dbuser = 'mirabeau'
    const dbpassword = 'loc12345'
    const fullUrl = `mongodb://${dbuser}:${dbpassword}@ds231956.mlab.com:31956/mirabeau`
    const client = await mongodb.MongoClient.connect(fullUrl,{
        useNewUrlParser: true
    })
    return client.db('mirabeau').collection('posts') 
}

module.exports = router;