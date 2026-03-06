function HighLight(elem,style){
    window.addEventListener('click',()=>{
      let element=document.createElement('div')
      let {clientX,clientY}=event
      element.id='highlighter'
      element.style.cssText='top:'+Number(clientY-style.size/2)+';left:'+Number(clientX-style.size/2)+';opacity:.5;height:'+style.size+'px;width:'+style.size+'px;background:'+style.background+';transform:scale('+style.zoomIn+');position:absolute;z-index:99;border-radius:100%'
      element.animate([
          {transform:'scale(1)',opacity:.5},
          {transform:'scale('+style.zoomOut+')',opacity:0}
          
      ],{
          duration:300,
          iterations:1
      })
      setTimeout(()=>{
        element.remove()
      },200)
      document.querySelector(elem).appendChild(element)
    })
    
}