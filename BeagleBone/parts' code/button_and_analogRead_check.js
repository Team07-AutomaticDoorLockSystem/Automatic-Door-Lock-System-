var b=require('bonescript');

var knockSensor='P9_40';
var lockMotor='P9_21';
var redLED='P9_27';
var greenLED='P9_30';
var programSwitch='P9_41';
var doorLockSwitch='P9_15';


var knockSensorValue=0;
var threshold=0.2;
var programButtonPressed=false;
var frequency=50;
var delay=1000;
var maximumKnocks=40;
var knockReadings=new Array(maximumKnocks);
var secretCode=new Array(50, 25, 25, 50, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
var knockFadeTime=400;
var knockComplete=600;
var rejectValue=25;
var averageRejectValue=15;




b.pinMode(lockMotor,b.ANALOG_OUTPUT);
b.pinMode(redLED,b.OUTPUT);
b.pinMode(greenLED,b.OUTPUT);
b.pinMode(programSwitch,b.INPUT);
b.pinMode(doorLockSwitch,b.INPUT);

b.digitalWrite(greenLED,b.HIGH);




setInterval(probe,10);


function probe(){
	b.digitalRead(programSwitch,redLEDFunc);
	//b.digitalRead(doorLockSwitch,doorLockFunc);
}

function redLEDFunc(x){
    if(x.value==1)
    {
        listenToSecretKnock();
    }
}


function knockCheck(x){
	if(x.value>0){
		knockSensorValue=x.value
		console.log('a '+knockSensorValue);
	}
}

function listenToSecretKnock(){
	console.log('Knock Starting');
	var i;
	for(i=0;i<maximumKnocks;i++){
		knockReadings[i]=0;
	}
	var currentKnockNumber=0;
	var d=new Date();
	var startTime=d.getTime();
	var now;
	
	do{
	    knockSensorValue = 0;
		b.analogRead(knockSensor, knockCheck);
		console.log('b '+knockSensorValue);
		if(knockSensorValue>=threshold){
			console.log('__________Knock__________');
			now=d.getTime();
			knockReadings[currentKnockNumber]=now - startTime;
			currentKnockNumber++;
			startTime=now;
			}
		now=d.getTime();
	}while((now-startTime < knockComplete) && (currentKnockNumber < maximumKnocks))

}