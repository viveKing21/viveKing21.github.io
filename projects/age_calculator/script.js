//current date variables
var fullDate=new Date();
var curDate=fullDate.getDate();
var curMonth=fullDate.getMonth()+1;
var curYear=fullDate.getFullYear();
if(curMonth < 10)
	curMonth="0" + curMonth;
if(curDate < 10)
	curDate="0" + curDate;
//selectors
var todayDate=document.form.TDate;
var Dob=document.form.TDOB;

//outpur selectors
let outputYear=document.querySelector("[data-year]");
let outputMonth=document.querySelector("[data-month]");
let outputDay=document.querySelector("[data-day]");
let effect=document.querySelector(".extras");
todayDate.value=curYear +"-"+ curMonth +"-"+ curDate;

var NXBDshow=true;
function ageResult()
{
document.querySelector(".dropdown").style.display="block";
    
    //effects
    effect.style.bottom="-20px";

	//getting values
	var tdate=todayDate.value.split("-");
	var yDob=Dob.value.split("-");
    var leftdaysofDOB=new Date(yDob[0],yDob[1],0).getDate();
    var leftdaysofthisBD=new Date(tdate[0],yDob[1],0).getDate();

    //calculation
    if(tdate[1] <= yDob[1])
    {
    	 NXBDshow=true;
       outputYear.innerText=tdate[0] - yDob[0] - 1;
       outputMonth.innerText=12 - yDob[1] + Number(tdate[1]) - 1;
       outputDay.innerText=leftdaysofDOB - yDob[2] + Number(tdate[2]);
       //on birthday
       if(tdate[1] == yDob[1] && tdate[2] == yDob[2])
       {
       	 outputYear.innerText=tdate[0] - yDob[0];
       	 outputMonth.innerText=0;
       	 outputDay.innerText=0;
       	 effect.innerText="HAPPY BIRTHDAY";
    	 events();
    	 NXBDshow=false;
       }
       //if birthday gone
       else if(tdate[1] == yDob[1] && tdate[2] > yDob[2])
       {
         outputYear.innerText=tdate[0] - yDob[0];
       	 outputMonth.innerText=0;
       	 outputDay.innerText=tdate[2] - yDob[2] + leftdaysofDOB - yDob[2];
       	 NXBDshow=false;
       }

    }

    else
    {
    	outputYear.innerText=tdate[0] - yDob[0];
    	outputMonth.innerText=tdate[1] - yDob[1] - 1;
    	outputDay.innerText=Number(tdate[2]) + leftdaysofthisBD - yDob[2];
    }
    //cases
    if(outputDay.innerText >= 31)
    {
    	outputMonth.innerText=Number(outputMonth.innerText) + 1;
    	outputDay.innerText=outputDay.innerText - 31;
    	effect.innerText="1 M (31 D) ADDED";
    	events();
    }



//fornextBD
let daysArray=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
let outputNXBDM=document.querySelector("[data-nextBdMonth]");
let outputNXBDD=document.querySelector("[data-nextBdday]");
var day=document.querySelector(".dayofnb");
var dayofBD=new Date(tdate[0],yDob[1]-1,yDob[2]);
   day.innerText=daysArray[dayofBD.getDay()];

var leftDayofthisM=new Date(tdate[0],tdate[1],0).getDate();
if(tdate[1] < yDob[1])
{
	outputNXBDM.innerText= yDob[1] - tdate[1] - 1;
	outputNXBDD.innerText=  Number(leftDayofthisM - tdate[2]) + Number(yDob[2]);
}
else if(tdate[1] == yDob[1])
{
	outputNXBDM.innerText=0;
	outputNXBDD.innerText=Number(yDob[2]) - Number(tdate[2]);
	if(tdate[1] == yDob[1] && tdate[2] > yDob[2])
	{
		outputNXBDM.innerText=11 - Number(tdate[1]) + Number(yDob[1]);
		outputNXBDD.innerText=Number(leftDayofthisM - tdate[2]) + Number(yDob[2]); 
	}
}
else if(tdate[1] > yDob[1])
{
    outputNXBDM.innerText=11 - Number(tdate[1]) + Number(yDob[1]);
    outputNXBDD.innerText=Number(leftDayofthisM - tdate[2]) + Number(yDob[2]); 
}
if(outputNXBDD.innerText >= 31)
{
	outputNXBDD.innerText=Number(outputNXBDD.innerText) - 31;
	outputNXBDM.innerText=Number(outputNXBDM.innerText) + 1;
}

//time spent on earth

let tseYear=document.querySelector("[data-value='Year']");
let tseMonth=document.querySelector("[data-value='Month']");


tseYear.innerText=outputYear.innerText;
tseMonth.innerText=tseYear.innerText * 12 + Number(outputMonth.innerText);
getTotalDays(yDob[0],tdate[0],yDob[1],tdate[1],tdate[2],yDob[2]);
    //show with 0 if it's less than 10
    if(outputYear.innerText < 10 && outputYear.innerText.length == 1)
    	outputYear.innerText="0" + outputYear.innerText;
    if(outputMonth.innerText < 10 && outputMonth.innerText.length == 1)
    	outputMonth.innerText="0" + outputMonth.innerText;
    if(outputDay.innerText < 10 && outputDay.innerText.length == 1)
    	outputDay.innerText="0" + outputDay.innerText;

     if(outputNXBDM.innerText < 10 && outputNXBDM.innerText.length == 1)
    	outputNXBDM.innerText="0" + outputNXBDM.innerText;
     if(outputNXBDD.innerText < 10 && outputNXBDD.innerText.length == 1)
    	outputNXBDD.innerText="0" + outputNXBDD.innerText;

	return false;
}


function events(){
    	effect.style.opacity="1";
    	effect.style.bottom="10px";
    	setTimeout(function () {effect.style.bottom="-20px"; },10000);	
}

function getTotalDays(DByear,TDyear,DBmonth,TDmonth,todayDate,dobDate)
{
	var days=0,status=false;
	let tseDay=document.querySelector("[data-value='Day']");
	let tseHour=document.querySelector("[data-value='Hour']");
	let tseMinute=document.querySelector("[data-value='Minute']");
	let tseSecond=document.querySelector("[data-value='Second']");
	let tseMilisec=document.querySelector("[data-value='Milisec']");
	var getday=new Date(DByear,DBmonth,0).getDate() - dobDate;
	for(var i=DByear; i<=TDyear; i++)
	{
		if(i==DByear)
		{
			for(var j=Number(DBmonth)+1; j<=12; j++)
			{
               days=new Date(i,j-1,0).getDate() + Number(days);
			}
			
            status=true;
		}
		else if(status && i !=TDyear)
		{
			for(var j=1; j<=12; j++)
			{
               days=new Date(i,j-1,0).getDate() + Number(days);
			}
		}
		else if(i==TDyear)
		{
			for(var j=1; j<TDmonth; j++)
			{
               days=new Date(i,j,0).getDate()  + Number(days);
               
			}
		}
	}
	tseDay.innerText=days + getday + Number(todayDate);
	tseHour.innerText=Number(tseDay.innerText)*24;
	tseMinute.innerText=Number(tseHour.innerText)*60;
	tseSecond.innerText=Number(tseMinute.innerText)*60;
	tseMilisec.innerText=Number(tseSecond.innerText) * 1000;


let daysArray=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
let monthsArray=["Jan","Feb","Mar","Apr",'May',"Jun","Jul","aug","sep","oct","nov","dec"];
var j=0,yearChk;
var NXBClasses=document.getElementsByClassName("NXB");

for(var i=Number(TDyear) + 1; i <= Number(TDyear) + 10; i++)
{
	yearChk=i;
	if(NXBDshow)
	{
		yearChk--;
		if(yearChk==yearChk+10)
			break;
	}
	var daysGet=new Date(yearChk,DBmonth-1,dobDate).getDay();
	var selectors=document.getElementsByClassName("showday")[j].innerText=daysArray[Number(daysGet)];

	NXBClasses[j].innerText=dobDate +" "+ monthsArray[Number(DBmonth-1)] +" "+ yearChk;
	j++

}

}
function showExtras(element){

	var selectors=document.getElementsByClassName("on");
	if(element.innerText=="EXTRA")
	{
	selectors[0].style.display="block";
	selectors[1].style.display="block";
	selectors[2].style.display="block";
	element.innerText="CLOSE";
	}
	else
	{
	selectors[0].style.display="none";
	selectors[1].style.display="none";
	selectors[2].style.display="none";
	element.innerText="EXTRA";
	}

}