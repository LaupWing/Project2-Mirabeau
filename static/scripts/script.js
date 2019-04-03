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
            if(select.name === 'sortOption'){
                if(select.value === 'High'){
                    console.log(select.value)
                }else if(select.value === 'Low'){
                    console.log(select.value)
                }else{
                    console.log('check')
                }
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

