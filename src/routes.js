const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const url = 'http://mirabeau.denniswegereef.nl/api/v1/rooms'

router.get('/', (req,res)=>{
    dataForRendering()
        .then(data=>{
            res.render('index',{
                data:       data.cleanData,
                keys:       data.keys,
                keysTitel:  data.keysTitel,
                values:     data.values,
                checked:    data.checked,
                page:       'partials/room',
                feeling:    data.cleanData.map(dataToTextObj)
            })
        })
})
router.post('/filter', (req,res)=>{
    const settings = {
        filtered:       true,
        info:           req.body.info,
        sortOption:     req.body.sortOption,
        availabilty:    req.body.availabilty
    }
    dataForRendering(settings)
        .then(data=>{
            res.render('index',{
                data:       data.cleanData,
                keys:       data.keys,
                keysTitel:  data.keysTitel,
                values:     data.values,
                checked:    data.checked,
                page:       'partials/room'
            })
        })
})

router.get('/:id', (req,res)=>{
    dataForRendering()
        .then(data=>{
            const filtered = data.cleanData.filter(item=>item.roomName===req.params.id)
            res.render('index',{
                data:       filtered,
                keys:       data.keys,
                keysTitel:  data.keysTitel,
                values:     data.values,
                checked:    data.checked,
                page:       'partials/detail'
            })
        })
})

function dataToTextObj(value){
    return{
        temperature:    transformData.temperature(value.temperature),
        co2:            transformData.co2(value.co2),
        soundLevel: 	transformData.soundLevel(value.soundLevel)
    }
}


// Credits to Stijn AA 
const transformData = {
    temperature: value=>{
        if      (value < 20)                    return 'Cool'
        else if (value > 20 && value < 22)      return 'Aangenaam'
        else if	(value > 22 && value < 23.5)    return 'Warm'
        else if (value > 23.5)                  return 'Heet'
    },
    co2: value=>{
        if      (value < 1000)                  return "Fris"
        else if (value > 1000 && value < 2000)  return "Ijl" 
        else if (value > 2000 && value < 5000)  return "Onveilig"
    },
    soundLevel: value => {
        if      (value < 15)                    return "Stil" 
        else if (value > 15 && value < 30)      return "Licht rumoerig" 
        else                                    return "Rumoerig"
    }
}


function dataForRendering(settings){
    console.log('settings: ',settings)
    return getData(url)
            .then(data => {
                let cleanData   =   data.map(room=>normalValues(room))
                let checked     =   ''
                if(settings){
                    if(settings.availabilty !== 'geen') cleanData = cleanData.filter(filterAvailability(settings.availabilty))
                    cleanData.sort(propComparator(settings.info, settings.sortOption))
                    checked = settings.info
                }
                let objectkeys  =   Object.keys(cleanData[0])
                const keys      =   objectkeys
                                        .filter(deleteItemFromArray.bind(null,'roomName'))
                                        .filter(deleteItemFromArray.bind(null, 'occupancy'))
                const keysTitel =   keys.map(splitAndCapatalize)
                const values    =   cleanData.map((item)=>{return Object.values(item)})
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
        const   bool  =   element.occupancy.toString()
        return  bool === condition
    }
}

function propComparator(prop, order) {
    return function(a, b) {
        if(order === 'Low') return a[prop] - b[prop];
        return b[prop] - a[prop];
    }
}


function normalValues(object){
    return {
        roomName:       object.room_name,
        temperature:    Math.round((object.measurements.temperature/1000)*10)/10,
        soundLevel:     object.measurements.mic_level/100,
        ambientLight:   object.measurements.ambient_light,
        co2:            object.measurements.co2,
        occupancy:      object.measurements.occupancy,
        humidity:       object.measurements.humidity
    }
}

function deleteItemFromArray(check, element){
    if(check !== element)   return element
}

function getData(url){
    return fetch(url)
        .then(response=>response.json())
        .then(data=>data.data)
}


module.exports = router