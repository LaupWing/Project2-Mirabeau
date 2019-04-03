const allRooms = Array.from(document.querySelectorAll('section.room'));
// document.querySelectorAll('select')
//     .forEach(select=>{
//         select.addEventListener('change', ()=>{
//             document.querySelectorAll('input[type="radio"]')
//                 .forEach(radio => {
//                     if(radio.checked){
//                         const array =[]
//                         allRooms.forEach(room=>{
//                             array.push(Array.from(room.querySelectorAll('.currentInfo')))
//                             room.querySelectorAll('.currentInfo')
//                                 .forEach(info=>{
//                                     if(info.classList[1] === radio.value){
//                                         if(radio.value === 'temperature'){
//                                             // console.log(info)
//                                             const number = Number(info.querySelector('h3').innerHTML.split(" ")[0])
//                                             console.log(number)
//                                             console.log(number.parentElement)
//                                         }
//                                     }
//                                 })
//                         })
//                         // console.log(array)
//                     }
//                 })
//         })
//     });

const radioBtns = Array.from(document.querySelectorAll('input[type="radio"]'))
const radioChecked= radioBtns
    .filter(radio=>{
        if(radio.checked){
            return radio
        }
    })
    .map(value=>value.value)
    .toString()

    
const select = document.querySelectorAll('select')
    .forEach(select=>{
        select.addEventListener('change', function(){
            const checked = Array.from(document.querySelectorAll('input[type="radio"]'))
                .filter((radio)=>{
                    return radio.checked
                })
                .map(radio=>{
                    return radio.value
                })
                .toString()
            console.log(checked)
            if(select.name === 'sortOption'){
                const sorting = allRooms.sort(propComparator(select.value, checked))
                sorting.forEach(s=>{
                    console.log(s.querySelector(`.${checked} h3`).innerHTML)
                })
            }else{
                if(select.value === 'false'){
                    console.log(select.value , 'filter not avail')
                }else if(select.value === 'true'){
                    console.log(select.value , 'filter avail')
                }else{
                    console.log(select, 'sort by availabity')
                    console.log(select.value)
                }
            }
        })
    })

console.log(allRooms)

function propComparator(order, categorie) {
    console.log(order, categorie)
    return function(a, b) {
        if(order === 'Low'){
            return Number(a.querySelector(`.${categorie} h3`).innerHTML) -Number(b.querySelector(`.${categorie} h3`).innerHTML)
        }else{
            return Number(b.querySelector(`.${categorie} h3`).innerHTML) - Number(a.querySelector(`.${categorie} h3`).innerHTML)
        }
    }
}
