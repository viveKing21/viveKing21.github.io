window.onload=function(){
		car.style.top=container.offsetHeight - land.offsetHeight - car.offsetHeight;
		coin.style.top=container.offsetHeight - land.offsetHeight - coin.offsetHeight-40;
		coin.style.left=Math.floor(Math.random()*(container.offsetWidth+200 - container.offsetWidth+100 + 1)  + container.offsetWidth+100);
		cashHere.innerHTML="<div>$</div>" + cash * 10;
	}
	var coin=document.querySelector('.coin');
	var car=document.querySelector('.car');
	var container=document.querySelector('.container');
	var land=document.getElementById('land');
	var jumpCar=true;
	var  light=document.querySelector(".light");
	var cash=0;
	var cashHere=document.querySelector(".cash");
	container.onclick=function(){
		if(jumpCar)
		{
     jumpCar=false;
     car.style.top=car.offsetTop - 80;
     car.style.transform="rotate(-20deg)";
     setTimeout(function(){
     	car.style.transform="rotate(20deg)";
     	car.style.top=car.offsetTop + 80;
     	
setTimeout(function(){car.style.transform="rotate(0deg)";jumpCar=true;car.style.top=193},400);
     
     },500)
     }

	}

	function lightEffect(){
		
	if(car.offsetTop > light.offsetTop+10 &&
	   car.offsetLeft > light.offsetLeft-10-car.offsetWidth 
	   	&& car.offsetLeft < light.offsetLeft+10  )
	{
		car.classList.add("carLight");
    }
	
	else
	{
		car.classList.remove("carLight");
	}   


	 setTimeout(lightEffect,1)
	}
    
    function lightMove()
    {
    	
    	light.style.left=light.offsetLeft - 1;
    	coin.style.left=coin.offsetLeft - 1;
        if(coin.offsetLeft  < car.offsetLeft + car.offsetWidth && 
           coin.offsetLeft > car.offsetLeft - coin.offsetWidth &&
           car.offsetTop < coin.offsetTop + coin.offsetHeight && 
           car.offsetTop > coin.offsetTop - coin.offsetHeight
        	)
        {
           coin.style.left=Math.floor(Math.random()*(container.offsetWidth+200 - container.offsetWidth+100 + 1)  + container.offsetWidth+100);
           document.getElementById('collectCoin').play();
           cash++;
           cashHere.innerHTML="<div>$</div>" + cash * 10;

        }
    	if(light.offsetLeft < 0)
    	{
    		light.style.left=Math.floor(Math.random()*(900 - 450 + 1)  + 450);
    	}
    	if(coin.offsetLeft < 0)
    	{
    		coin.style.left=Math.floor(Math.random()*(container.offsetWidth+200 - container.offsetWidth+100 + 1)  + container.offsetWidth+100);
    	}
    	setTimeout(lightMove,20);
    }
    lightMove();
    lightEffect();


    setInterval(function(){

    },20);