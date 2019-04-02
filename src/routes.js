const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const url = 'http://mirabeau.denniswegereef.nl/api/v1/rooms'

router.get('/', (req,res)=>{
    getData(url)
        .then(data => {
            const cleanData = data.map(room=>normalValues(room))
            let objectkeys = Object.keys(cleanData[0])
            const keys = objectkeys
                                .filter(deleteItemFromArray.bind(null,'roomName'))
                                .filter(deleteItemFromArray.bind(null, 'occupancy'))
            const keysTitel = keys.map(splitAndCapatalize)
            const values = cleanData.map((item)=>{return Object.values(item)})
            console.log(res.render)
            res.render('index',{
                data: cleanData,
                keys,
                keysTitel,
                values
            })
        })
})

function splitAndCapatalize(word){
    return (word[0].toUpperCase()+word.slice(1)).match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
}

function normalValues(object){
    return {
        roomName: object.room_name,
        temperature: Math.round((object.measurements.temperature/1000)*10)/10,
        soundLevel: object.measurements.mic_level/100,
        ambientLight: object.measurements.ambient_light,
        co2: object.measurements.co2,
        occupancy: object.measurements.occupancy,
        humidity: object.measurements.humidity
    }
}

function deleteItemFromArray(check, element){
    if(check !== element){
        return element
    }
}

function getData(url){
    return fetch(url)
        .then(response=>response.json())
        .then(data=>data.data)
}


module.exports = router;