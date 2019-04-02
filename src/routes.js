const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const url = 'http://mirabeau.denniswegereef.nl/api/v1/rooms'

router.get('/', (req,res)=>{
    dataForRendering()
        .then(data=>{
            res.render('index',{
                data: data.cleanData,
                keys: data.keys,
                keysTitel: data.keysTitel,
                values: data.values,
                checked: data.checked
            })
        })
})
router.post('/filter', (req,res)=>{
    const settings = {
        filtered: true,
        info: req.body.info,
        sortOption: req.body.sortOption,
        availabilty: req.body.availabilty
    }
    dataForRendering(settings)
        .then(data=>{
            res.render('index',{
                data: data.cleanData,
                keys: data.keys,
                keysTitel: data.keysTitel,
                values: data.values,
                checked: data.checked
            })
        })
})

function dataForRendering(settings){
    console.log('settings: ',settings)
    return getData(url)
            .then(data => {
                let cleanData = data.map(room=>normalValues(room))
                let checked = ''
                if(settings){
                    if(settings.availabilty !== 'geen'){
                        console.log('volgens mij heb ik het')
                        cleanData = cleanData.filter(filterAvailability(settings.availabilty))
                    }else{
                        console.log('None')
                    }
                    cleanData.sort(propComparator(settings.info, settings.sortOption))
                    checked = settings.info
                }
                // console.log(cleanData)
                let objectkeys = Object.keys(cleanData[0])
                const keys = objectkeys
                                    .filter(deleteItemFromArray.bind(null,'roomName'))
                                    .filter(deleteItemFromArray.bind(null, 'occupancy'))
                const keysTitel = keys.map(splitAndCapatalize)
                const values = cleanData.map((item)=>{return Object.values(item)})
                return{
                    keys,
                    cleanData,
                    keysTitel,
                    values,
                    checked
                }
            })
}

function splitAndCapatalize(word){
    return (word[0].toUpperCase()+word.slice(1)).match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
}

function filterAvailability(condition){
    return function(element){

        // if(condition === 'false'){
        //     if(element.occupancy === false){
        //         return element
        //     }
        // }else{
        //     if(element.occupancy === true){
        //         return element
        //     }
        // }
        // Dit hieronder werkt niet??? (als element.occupancy(true) gelijk is aan condtion(true))
        // console.log(conditio.toString())
        const bool = element.occupancy.toString()
        return bool === condition
    }
}

function propComparator(prop, order) {
    return function(a, b) {
        if(order === 'Low'){
            return a[prop] - b[prop];
        }else{
            return b[prop] - a[prop];
        }
    }
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


module.exports = router