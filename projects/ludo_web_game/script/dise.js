let onRunDice=new Audio('./sound/dice.mp3')
let stopAt=['transform:rotateX(180deg);transform-origin:center',
            'transform:rotateY(90deg);transform-origin:left',
            'transform:rotateY(-90deg);transform-origin:right',
            'transform:rotateX(270deg);transform-origin:top',
            'transform:rotateX(90deg);transform-origin:bottom',
            'transform:rotateX(0deg);transform-origin:center']
let diseNum=1
let Cube=document.querySelector('.cube')
const ThrowDise=(e)=>{
    if(!moveMe){
        document.querySelector('.ludo').style.setProperty('background','white')
        Cube.removeAttribute('style')
        Cube.classList.add('Animate_play')
        Cube.classList.remove('Animate_pause')
        console.log(turnOf.activePlayers[turnOf.active-1]==1 ? 'Y':turnOf.activePlayers[turnOf.active-1]==2 ? 'G':turnOf.activePlayers[turnOf.active-1]==3 ? 'R':'B')
    diseNum=Math.floor(Math.random() * (7 - 1) + 1) > 6 ? 6:Math.floor(Math.random() * (7 - 1) + 1)
    setTimeout(()=>{
        Cube.classList.remove('Animate_play')
		Cube.classList.remove('Animate_pause')
        Cube.style.cssText=stopAt[diseNum-1]
        moveMe=true
        
        let Forwarder=null
        if(turnOf.activePlayers[turnOf.active-1]==1)
        Forwarder=Yellow.PiecePos.map((ar)=>ar[0])
        else if(turnOf.activePlayers[turnOf.active-1]==2)
        Forwarder=Green.PiecePos.map((ar)=>ar[0])
        else if(turnOf.activePlayers[turnOf.active-1]==3)
        Forwarder=Red.PiecePos.map((ar)=>ar[0])
        else if(turnOf.activePlayers[turnOf.active-1]==4)
        Forwarder=Blue.PiecePos.map((ar)=>ar[0])
        if(Forwarder.indexOf(true) == -1 && diseNum!==6)
        {
          turnOf.active=turnOf.active==turnOf.activePlayers.length ? 1:turnOf.active+1
          moveMe=false
          turnOfPlayer() 
          
          //if none pieces unlocked & cant unlock with this number
        }
        else if(Forwarder.indexOf(false) > -1 && diseNum==6)
        {}
        else
        canMove()
        document.querySelector('.ludo').style.setProperty('background','#f0f0f0')
    },3000)
    onRunDice.play()
    }
}
function canMove(){
    let Available='',Next=''

    if(turnOf.activePlayers[turnOf.active-1]==1)
    Available=Yellow.PiecePos.filter(ar=>ar[0]==true)
    else if(turnOf.activePlayers[turnOf.active-1]==2)
    Available=Green.PiecePos.filter(ar=>ar[0]==true)
    else if(turnOf.activePlayers[turnOf.active-1]==3)
    Available=Red.PiecePos.filter(ar=>ar[0]==true)
    else if(turnOf.activePlayers[turnOf.active-1]==4)
    Available=Blue.PiecePos.filter(ar=>ar[0]==true)

    if(Available.length > 0)
    {
        for(let i=0; i<Available.length; i++){
            if(57-Available[i][1] >= diseNum)
            {
                Next=true
                break;
            } 
            else{
                Next=false
                console.log('turn changed')
            }
        }
        if(!Next)
        {
            moveMe=false
            turnOf.active=turnOf.active==turnOf.activePlayers.length ? 1:turnOf.active+1
            turnOfPlayer() 
        }
    }
}