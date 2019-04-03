const allRooms = Array.from(document.querySelectorAll('section.room'));
document.querySelectorAll('select')
    .forEach(select=>{
        select.addEventListener('change', ()=>{
            console.log(select.value)
        })
    });
