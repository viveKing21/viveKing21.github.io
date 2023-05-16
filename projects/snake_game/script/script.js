
bgOfContainer=document.getElementById('bgOfContainer');
textOfstartandover=document.getElementById('start&over');
var point=document.getElementById('newPoint');
var container=document.querySelector('.container');
var snake=document.querySelector('.snake');
var animateLeft,animateTop,animateRight,animateDown,watchtime;
var pointEaten=1,pointchecker=1;;
var bigMe=document.getElementById("BigME");
//timer variables declared
var timerS=document.getElementById('timerS');
var timerM=document.getElementById('timerM');
var speedSelector=document.getElementById('speed');
var s=0,m=0,speed=20,speedShow=1;

//audio selector
let pointCollectSound=document.getElementById('pointCollect');
let bigMeCollectSound=document.getElementById('bigMeCollect');
let gameOverSound=document.getElementById('gameOver');

var leftbtn=true;
var rightbtn=true;
var topbtn=true;
var bottombtn=true;

var status="enable";

sessionStorage.setItem("Hscore",0);

var speedType=document.getElementById('maxormin');

function play(playME){
onkeydown=function checkKey(e) {
    var event = window.event ? window.event : e;

    if( event.keyCode == 37 && rightbtn==true && status=="enable")
    {   

    		runRight();
            rightbtn=false;
            topbtn=true;
            bottombtn=true;
            leftbtn=true;
    	
    }
    else if( event.keyCode == 38 && topbtn==true && status=="enable")
    { 
    	    runUp();
    	    rightbtn=true;
            topbtn=false;
            bottombtn=true;
            leftbtn=true;
    }
    else if( event.keyCode == 39 && leftbtn==true && status=="enable")
    {
    	runLeft();
            rightbtn=true;
            topbtn=true;
            bottombtn=true;
            leftbtn=false;
    }
    else if( event.keyCode == 40 && bottombtn==true && status=="enable")
    {
    	runDown();
            rightbtn=true;
            topbtn=true;
            bottombtn=false;
            leftbtn=true;
    }
   

}
playME.onclick=runLeft();
function runLeft()//run snake to left
{
	clearTimeout(animateRight);
	clearTimeout(animateTop);
	clearTimeout(animateDown);
	snake.style.left=parseInt(snake.style.left)+1;
	animateLeft=setTimeout(runLeft,speed)//speed  control
	if(snake.style.left.replace("px","") > container.clientWidth - snake.offsetWidth)
	{
		clearTimeout(animateLeft);
	}


	
	eatMe()
}
function runRight()//run snake to right
{
	clearTimeout(animateLeft);
	clearTimeout(animateTop);
	clearTimeout(animateDown);
	snake.style.left=parseInt(snake.style.left)-1;
	animateRight=setTimeout(runRight,speed);
	if(snake.style.left.replace("px","") < 0)
	{
		clearTimeout(animateRight);
	}

	eatMe()

}

function runDown()//run snake to down
{
	clearTimeout(animateLeft);
	clearTimeout(animateTop);
	clearTimeout(animateRight);
    snake.style.top=parseInt(snake.style.top)+1;
    animateDown=setTimeout(runDown,speed);
    if(snake.style.top.replace("px","") > container.clientHeight - snake.clientHeight)
	{
		clearTimeout(animateDown);
	}

	eatMe()

}

function runUp()//run snake to up
{
	clearTimeout(animateLeft);
	clearTimeout(animateRight);
	clearTimeout(animateDown);
    snake.style.top=parseInt(snake.style.top)-1;
    animateTop=setTimeout(runUp,speed);
    if(snake.style.top.replace("px","") < 0)
	{
		clearTimeout(animateTop);
	}

	eatMe()

}

function eatMe()//game over and points collect
{   
	
	var pTop=point.offsetTop-snake.offsetHeight;
	var pLeft=point.offsetLeft-snake.offsetWidth;
	var rvTop=point.offsetTop+point.offsetHeight;
	var rvLeft=point.offsetLeft+point.offsetWidth;
	var sTop=snake.offsetTop;
	var sLeft=snake.offsetLeft;
    if(sTop > pTop && sLeft  > pLeft && sTop < rvTop && sLeft < rvLeft)
    {
       
      //on points collected

       pointsCreator();
       snake.classList.add("snakeFx2");
       setTimeout(function () {snake.classList.remove("snakeFx2")},1000);
       document.querySelector("p").innerText=pointEaten;
       pointCollectSound.play();
       
       //big me creator
       if(pointEaten == pointchecker * 10)
       {
          BigME();
          pointchecker++;
       }
       pointEaten++;
       
    }
    var gmOverLeft=container.clientWidth-snake.clientWidth;
    var gmOverTop=container.clientHeight-snake.clientHeight;
    //on game over
    if(snake.offsetLeft > gmOverLeft || snake.offsetLeft < 0 || snake.offsetTop > gmOverTop || snake.offsetTop < 0)
    {
  
        
        if(sessionStorage.getItem("Hscore") < pointEaten-1)
        {
            sessionStorage.setItem("Hscore",pointEaten-1);
            document.getElementById("hscore").innerText=sessionStorage.getItem("Hscore");
        }


    	snake.style.left=0;
    	snake.style.top=0;
    	snake.style.setProperty("height",null);
    	snake.style.setProperty("width",null);
    	snake.classList.remove("snakeFx");
        point.style.display="none";
        bigMe.style.display="none";
        pointEaten=1;
        pointchecker=1;
        speed=20;
        speedShow=1;
        speedSelector.innerText=1;
        speedType.innerText="MIN SPEED";
        snake.classList.add("snakePosition");
        setTimeout(function()
        	{
        		if(snake.classList.contains("snakePosition"))
        		{snake.innerHTML="<i class='fas fa-play-circle' onclick='play(this)'></i>";}
        	},1000);
 
        bgOfContainer.style.display="block";
        textOfstartandover.innerText="GAME OVER";
        clearTimeout(watchtime);
        s=0;
        m=0;
        timerS.innerText="00";
        timerM.innerText="00";
        status="disabled";
        gameOverSound.play();
        return;
    }
    //add Fx here on start game
    else
    {
    	snake.innerText="";
    	snake.classList.add("snakeFx");
    	snake.classList.remove("snakePosition");
    	    setTimeout(function()
        	{
        	point.style.display="block";
        	},2000);
        bgOfContainer.style.display="none";

        
        
    }
    
bigMeEaten();
}
window.onload=pointsCreator();
//on point collect add fx
function pointsCreator(){
/*	var newPoint=document.createElement("div");
	container.appendChild(newPoint);
	newPoint.classList.add("points");
	newPoint.setAttribute("id","newPoint"); *///not creating new div cause than its not selecting same class

	point.style.setProperty("left",Math.floor(Math.random() * container.clientWidth-point.clientWidth) + "px");
	point.style.setProperty("top",Math.floor(Math.random() * container.clientHeight-point.clientHeight)  + "px");
    if(point.style.left.indexOf("-") !== -1)
    {
         point.style.setProperty("left","0px");
    }
    if(point.style.top.indexOf("-") !== -1)
    {
         point.style.setProperty("top","0px");
    }
    

}
function BigME(){

//remove bigme
if(bigMe.style.display == "none")
{
setTimeout(function(){
	
		bigMe.style.display="none"; 
	bigMe.style.setProperty("left",null);
    bigMe.style.setProperty("top",null);
    return;
},5000);
bigMe.style.display="block";
//bigMe poisitioning
bigMe.style.setProperty("left",Math.floor(Math.random() * container.clientWidth-bigMe.clientWidth) + "px");
	bigMe.style.setProperty("top",Math.floor(Math.random() * container.clientHeight-bigMe.clientHeight)  + "px");
    if(bigMe.style.left.indexOf("-") !== -1)
    {
         bigMe.style.setProperty("left","0px");
    }
    if(bigMe.style.top.indexOf("-") !== -1)
    {
         bigMe.style.setProperty("top","0px");
    }

}
}
function bigMeEaten(){

	var bigTop=bigMe.offsetTop-snake.offsetHeight;
	var bigLeft=bigMe.offsetLeft-snake.offsetWidth;
	var bigrvTop=bigMe.offsetTop+bigMe.offsetHeight;
	var bigrvLeft=bigMe.offsetLeft+bigMe.offsetWidth;
	var sTop=snake.offsetTop;
	var sLeft=snake.offsetLeft;
	//on eat bigMe
    if(sTop > bigTop && sLeft  > bigLeft && sTop < bigrvTop && sLeft < bigrvLeft)
    {
       snake.style.width=snake.offsetWidth + 2 +"px";
       snake.style.height=snake.offsetHeight + 2 +"px";
       snake.style.left=snake.style.left - 1;
       snake.style.top=snake.style.top - 1;
       bigMe.style.display="none";
       snake.classList.add("bigMeFx");
       setTimeout(function () {snake.classList.remove("bigMeFx")},1000);
       bigMeCollectSound.play();
       pointEaten=pointEaten+9;
       pointchecker=pointchecker+1;
       document.querySelector("p").innerText=pointEaten;
       pointEaten++;
    }

}
//on click start
document.querySelector("p").innerText=0;
status="enable";
setTimer();
return false
}
window.onload=function loadtxt(){
if(textOfstartandover.innerText=="GAME OVER")
{

	container.onmouseover=function(){textOfstartandover.innerText="START AGAIN";}
}
else
{
	textOfstartandover.innerText=textOfstartandover.innerText;
}
setTimeout(loadtxt,20);
}

function setTimer(){
	s++;

	if(s == 60)
	{
		s=0;
		m++;
		if(m < 10)
	    {
		m="0".concat(m);
	    }
	    timerM.innerText=m;
        //speed of snake
	    if(m <= 20)
	    {
	      speed--;
	      speedShow++;
	      speedSelector.innerText=speedShow;
	      
	      if(m >= 2 && m <= 9 )
	      {
            speedType.innerText="NORMAL";
	      }
	      else if(m == 10)
	      {
	      	speedType.innerText="AVG SPEED";
	      }

	      else if(m >= 11 && m<= 19)
	      {
             speedType.innerText="HIGH";
	      }
	    }
	    else
	    {
           speedType.innerText="MAX SPEED";
	    }
	    
	}
	if(s < 10)
	{
		s="0".concat(s);
	}
	timerS.innerText=s;

	watchtime=setTimeout(setTimer,1000);

}