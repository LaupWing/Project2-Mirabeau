const express   = require('express');
const router    = express.Router();
const dataMethods = require('./data');
const {dataToTextObj} = dataMethods;
const {dataForRendering} = dataMethods; 

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
                page:       'partials/room',
                feeling:    data.cleanData.map(dataToTextObj)
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

module.exports = router