
const cube = document.getElementById('cube')
const container=document.querySelector('.container')
const goBack=document.getElementById('goBack')
    let x = 0
    let viewX = 0
    let viewY = 0
    let viewZ = 0
    let clientXVal = 0
    let clientYVal = 0
    let halfW = innerWidth / 2
    let halfH = innerHeight / 2
    let isDragging = false
    let previousY = 0
    let previousX = 0
    window.onmousemove = (e) => {
        if (isDragging)
            view(e)
    }

    window.onmousedown = () => isDragging = true
    window.onmouseup = () => {
        previousY = viewY
        previousX = viewX
        clientXVal = 0
        clientYVal = 0
        isDragging = false
    }
    function view(e) {
        clientYVal += e.movementY
        clientXVal += e.movementX
        clientX = clientXVal
        clientY = clientYVal
        viewY = clientX + previousY
        viewX = Math.abs(clientY + previousX) > 45 ? clientY + previousX < 0 ? -45:45:clientY + previousX
        cube.style.transform = 'translateZ(100px) rotateX(' + viewX + 'deg) rotateY('+viewY+'deg)'
    }
    function selectorCreator(num){
        let selector=document.querySelector('.selector')
        let box=document.createElement('div')
        box.innerHTML='<i class="fas fa-eye"></i>'
        box.setAttribute('onclick','viewWorld('+num+')')
        box.className='selectorBox'
        box.style='background:url(images/world/'+num+'.png);  background-position:calc(100% / 3 * 2) 50%'
        selector.appendChild(box)
    }
    for(i=1; i<6; i++)
    {
        selectorCreator(i)
    }
    function viewWorld(num)
    {
        Array.from(document.querySelectorAll('.insideView')).map(elem=>elem.style='--location:url("../images/world/'+num+'.png")')
        container.style.display='none'
        cube.style.display='block'
        goBack.style.display='block'
    }
    goBack.onclick=()=>{
        container.style.display='flex'
        cube.style.display='none'
        goBack.style.display='none'
    }