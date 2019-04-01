const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const url = 'http://mirabeau.denniswegereef.nl/api/v1/rooms'

router.get('/', (req,res)=>{
    getData(url)
        .then(data => {

            const cleanData = data.map(room=>normalValues(room))
            const keys = Object.keys(cleanData[0])
            console.log(deleteItemFromArray(keys, 'roomName'))
            res.render('index',{
                data: cleanData,
                keys
            })
        })
})

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

function deleteItemFromArray(array, item){
    const index = array.indexOf(item)
    console.log(index)
    // Als een item niet bestaat dan word die weergeven als een -1
    if(index>-1){
        array.splice(index,1)
    }
    return array
}

function getData(url){
    return fetch(url)
        .then(response=>response.json())
        .then(data=>data.data)
}


module.exports = router;