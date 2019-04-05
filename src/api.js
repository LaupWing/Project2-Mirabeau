const express           =   require('express');
const mongodb           =   require('mongodb');
const axios             =   require('axios');
const router            =   express.Router();
const apiUrl            =   'http://localhost:3001/api'
const {getData}         =   require('./data');
const {normalValues}    =   require('./data');
const moment            =   require('moment');
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
    const cleanData = await getRoomDataGetDate();
    cleanData.forEach(async cleanData=>{
        await posts.insertOne({
            date:           cleanData.date,
            roomName:       cleanData.roomName,
            temperature:    cleanData.temperature,
            soundLevel:     cleanData.soundLevel,
            ambientLight:   cleanData.ambientLight,
            co2:            cleanData.co2,
            humidity:       cleanData.humidity
        });
    })
})

function getRoomDataGetDate(){
    return getData('http://mirabeau.denniswegereef.nl/api/v1/rooms')
            .then(data=>{
                const cleanData = data
                    .map(normalValues)
                    .map(room=>{
                        room.date = new Date()
                        return room
                    })
                return cleanData
            })
}

async function checkTimePost(){
    let date    =   await getRoomDataGetDate()
    date        =   moment(date[0].date, "YYYY-MM-DD HH:mm:ss")
    if(date.format("HH")>14){
        console.log('-------------posting to backend-------------')
        axios.post(apiUrl)
            .then(response=>{console.log('response')})
            .catch(err=>{console.log('yay')})
        return
    }
    console.log('Niet voor 2 uur geen post')
    
}
async function getDataFromMongoDB(){
        try{
            const res           =   await axios.get(apiUrl)
            const data          =   res.data;
            const latestDate    =   moment(data[data.length - 13].date, "YYYY-MM-DD HH:mm:ss");
            const newDate       =   moment(data[data.length - 12].date, "YYYY-MM-DD HH:mm:ss")        
            if(latestDate.format('Do') !== newDate.format('Do')){
                console.log('Geen nieuwe dag')
                return
            }
            checkTimePost()
            console.log('nieuwe dage')
        }
        catch(err){
            console.log('errrror',err)
        }
}

getDataFromMongoDB()



// axios.post(apiUrl)
//     .then(response=>{console.log('response')})
//     .catch(err=>{console.log('yay')})

// Functie om een connectie te maken met de post collectie
async function loadPostCollection(){
    const dbuser        =       'mirabeau'
    const dbpassword    =       'loc12345'
    const fullUrl       =       `mongodb://${dbuser}:${dbpassword}@ds231956.mlab.com:31956/mirabeau`
    const client        =       await mongodb.MongoClient.connect(fullUrl,{
        useNewUrlParser: true
    })
    return client.db('mirabeau').collection('posts') 
}

module.exports = router;