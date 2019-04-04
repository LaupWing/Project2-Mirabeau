const allRooms      = Array.from(document.querySelectorAll('section.room'));
const radioBtns     = Array.from(document.querySelectorAll('input[type="radio"]'))
let filterToggle    = false
let filteredArray   = []
document.querySelector('nav#sort_filter')
    .removeChild(document.querySelector('nav#sort_filter button'))

document.querySelectorAll('a')
    .forEach(a=>{
        a.addEventListener('click', ()=>{
            event.preventDefault()
            console.log(a.href)
            fetch(a.href)
                .then(body=>body.text())
                .then(body=>{
                    const res = body
                        .replace('title>Home page</title>', '')
                        .replace('<meta charset="UTF-8">', '')
                        .replace('<meta name="viewport" content="width=device-width, initial-scale=1.0">', '')
                        .replace('<meta http-equiv="X-UA-Compatible" content="ie=edge">', '')
                        .replace('<link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">', '')
                        .replace('<link rel="stylesheet" href="./style/main.css">', '')
                    document.body.innerHTML = res
                })
        })
    })
radioBtns.forEach(radio=>{
    radio.addEventListener('change', ()=>{
        sortItems(document.querySelector('#sortOption').value)
    })
})



const select = document.querySelectorAll('select')
    .forEach(select=>{
        select.addEventListener('change', function(){
            if(select.name === 'sortOption'){
                sortItems(select.value)
            }else{
                if(select.value === 'geen'){
                    filterToggle = false
                    sortItems(document.querySelector('#sortOption').value)
                }else{
                    filterList(allRooms, select.value)
                }
            }
        })
    })
    
function sortItems(value){
    const checked = Array.from(document.querySelectorAll('input[type="radio"]'))
        .filter((radio)=> radio.checked)
        .map(radio=>radio.value)
        .toString()
    
    const sorted    = checkFiltered().sort(elementComparator(value, checked))
    const container = document.querySelector('.justAnotherContainer')
    removeChilds(container)
    addElements(sorted, container)
}

function filterList(list, value){
    const container     =   document.querySelector('.justAnotherContainer') 
    const filtered      =   list.filter(filtering(value))
    filterToggle        =   true
    filteredArray       =   filtered
    removeChilds(container)
    addElements(filtered, container)
}


function checkFiltered(){
    if(filterToggle)    return filteredArray
                        return allRooms
}


function filtering(value){
    return (el) => el.querySelector('h2').classList[0] === value
}

function removeChilds(container){
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
}

function addElements(nodeList, container){
    // It saids nodelist but it is actually an array with elements
    nodeList.forEach(node=>container.appendChild(node))
}


function elementComparator(order, categorie) {
    console.log(order, categorie)
    return function(a, b) {
        if(order === 'Low'){
            if (categorie === 'temperature'){
                return  Number(a.querySelector(`.${categorie} h3`)
                            .innerHTML
                            .trim()
                            .split(" ")[0]) 
                        -
                        Number(b.querySelector(`.${categorie} h3`)
                            .innerHTML
                            .trim()
                            .split(" ")[0])
            }
            return  Number(a.querySelector(`.${categorie} h3`).innerHTML) 
                    -
                    Number(b.querySelector(`.${categorie} h3`).innerHTML)
        }else{
            if (categorie === 'temperature'){
                return  Number(b.querySelector(`.${categorie} h3`)
                            .innerHTML
                            .trim()
                            .split(" ")[0]) 
                        -
                        Number(a.querySelector(`.${categorie} h3`)
                            .innerHTML
                            .trim()
                            .split(" ")[0])
            }
            return  Number(b.querySelector(`.${categorie} h3`).innerHTML) 
                    - 
                    Number(a.querySelector(`.${categorie} h3`).innerHTML)
        }
    }
}
