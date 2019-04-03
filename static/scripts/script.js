const allRooms = Array.from(document.querySelectorAll('section.room'));
const radioBtns = Array.from(document.querySelectorAll('input[type="radio"]'))
const select = document.querySelectorAll('select')
    .forEach(select=>{
        select.addEventListener('change', function(){
            if(select.name === 'sortOption'){
                sortItems(select.value)
            }else{
                if(select.value === 'geen') return
                
            }
        })
    })
    
function sortItems(value){
    const checked = Array.from(document.querySelectorAll('input[type="radio"]'))
        .filter((radio)=> radio.checked)
        .map(radio=>radio.value)
        .toString()
    const sorted = allRooms.sort(elementComparator(value, checked))
    const container = document.querySelector('.justAnotherContainer')
    removeChilds(container)
    addElements(sorted, container)
}



function removeChilds(container){
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
}

function addElements(nodeList, container){
    // It saids nodelist but it is actually an array with elements
    nodeList.forEach(node=>{
        container.appendChild(node)
    })
}



function elementComparator(order, categorie) {
    console.log(order, categorie)
    return function(a, b) {
        if(order === 'Low'){
            if (categorie === 'temperature'){
                return Number(a.querySelector(`.${categorie} h3`).innerHTML.split(" ")[0]) -Number(b.querySelector(`.${categorie} h3`).innerHTML.split(" ")[0])
            }
            return Number(a.querySelector(`.${categorie} h3`).innerHTML) -Number(b.querySelector(`.${categorie} h3`).innerHTML)
        }else{
            if (categorie === 'temperature'){
                return Number(b.querySelector(`.${categorie} h3`).innerHTML.split(" ")[0]) -Number(a.querySelector(`.${categorie} h3`).innerHTML.split(" ")[0])
            }
            return Number(b.querySelector(`.${categorie} h3`).innerHTML) - Number(a.querySelector(`.${categorie} h3`).innerHTML)
        }
    }
}
