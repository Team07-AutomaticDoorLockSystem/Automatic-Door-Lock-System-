var b=require('bonescript');

var knockSensor='P9_40';
var lockMotor='P9_21';
var redLED='P9_27';
var greenLED='P9_30';
var programSwitch='P9_41';
var doorLockSwitch='P9_15';



var programButtonPressed=false;
var threshold=0;
var maximumKnocks=40;
var knockReadings=new Array(maximumKnocks);
var secretCode=new Array(100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
var knockFadeTime=150;
var knockSensorValue=0;
var knockComplete=1200;
var frequency=50;
var delay=1000;
var rejectValue=25;
var averageRejectValue=15;



b.pinMode(lockMotor,b.ANALOG_OUTPUT);
b.pinMode(redLED,b.OUTPUT);
b.pinMode(greenLED,b.OUTPUT);
b.pinMode(programSwitch,b.INPUT);
b.pinMode(doorLockSwitch,b.INPUT);

b.digitalWrite(greenLED,b.HIGH);



setInterval(probe,1);



function probe(){
	b.digitalRead(programSwitch,redLEDFunc);
	b.analogRead(knockSensor,knockCheck);
	if(knockSensorValue>=threshold){
		//listenToSecretKnock();
		console.log(knockSensorValue);
	}
	b.digitalRead(doorLockSwitch,doorLockFunc);
}


function doorLockFunc(x){
	if(x.value==1){
		rotateTheAxis(0.2);
	}
}


function redLEDFunc(x){
	if(x.value==1){
		programButtonPressed=true;
		b.digitalWrite(redLED,b.HIGH);
	}
	else{
		programButtonPressed=false;
		b.digitalWrite(redLED,b.LOW);
	}
}


function knockCheck(x){
	knockSensorValue=x.value;
	
}


function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
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

	b.digitalWrite(greenLED,b.LOW);
	if(programButtonPressed==true){
		b.digitalWrite(redLED,b.LOW);
	}
	wait(knockFadeTime);
	b.digitalWrite(greenLED,b.HIGH);
	if(programButtonPressed==true){
		b.digitalWrite(redLED,b.HIGH);
	}

	do{
		b.analogRead(knockSensor,knockCheck);
		if(knockSensorValue>=threshold){
			console.log('__________Knock__________');
			now=d.getTime();
			knockReadings[currentKnockNumber]=now - startTime;
			currentKnockNumber++;
			startTime=now;
			b.digitalWrite(greenLED,b.LOW);
			if(programButtonPressed==true){
				b.digitalWrite(redLED,b.LOW);
			}
			wait(knockFadeTime);
			b.digitalWrite(greenLED,b.HIGH);
			if(programButtonPressed==true){
				b.digitalWrite(redLED,b.HIGH);
			}
		}
		now=d.getTime();
	}while((now-startTime < knockComplete) && (currentKnockNumber < maximumKnocks))


	if(programButtonPressed==false){
		if(validateKnock()==true){
			triggerDoorUnlock();
		}
		else{
			console.log('__________Secret Knock Failed__________');
			b.digitalWrite(greenLED,b.LOW);
			for (i=0;i<4;i++){					
        		b.digitalWrite(redLED, b.HIGH);
        		wait(100);
        		b.digitalWrite(redLED, b.LOW);
        		wait(100);
      		}
      		b.digitalWrite(greenLED, b.HIGH);
		}
	}
	else{
		validateKnock();
		console.log('__________New Lock Stored__________');
		b.digitalWrite(redLED, b.LOW);
    	b.digitalWrite(greenLED, b.HIGH);
    	var x;
    	for (x=0;x<3;x++){
    	  wait(100);
    	  b.digitalWrite(redLED, b.HIGH);
    	  b.digitalWrite(greenLED, b.LOW);
    	  wait(100);
    	  b.digitalWrite(redLED, b.LOW);
    	  b.digitalWrite(greenLED, b.HIGH);      
    	}
	}


}


function triggerDoorUnlock(){
	console.log('__________Door Unlocked__________');

	rotateTheAxis(2.0);

	b.digitalWrite(greenLED, b.HIGH); 
	var i;
	for (i=0; i < 5; i++){   
      b.digitalWrite(greenLED, b.LOW);
      wait(100);
      b.digitalWrite(greenLED, b.HIGH);
      wait(100);
  }
}

function rotateTheAxis(pos){
    var dutyCycle = pos/1000*frequency;
    b.analogWrite(lockMotor, dutyCycle, frequency);
    wait(delay);
}


function validateKnock(){
	var currentKnockCount=0;
	var secretKnockCount=0;
	var maxKnockInterval=0;
	var i;
	for(i=0;i<maximumKnocks;i++){
		if(knockReadings[i]>0){
			currentKnockCount++;
		}
		if(secretCode[i]>0){
			secretKnockCount++;
		}
		if(knockReadings[i]>maxKnockInterval){
			maxKnockInterval=knockReadings[i];
		}
	}
	if(programButtonPressed==true){
		for (i=0;i<maximumKnocks;i++){
        	secretCode[i]= map(knockReadings[i],0, maxKnockInterval, 0, 100); 
      	}
      	b.digitalWrite(greenLED, b.LOW);
      	b.digitalWrite(redLED, b.LOW);
      	wait(1000);
      	b.digitalWrite(greenLED, b.HIGH);
      	b.digitalWrite(redLED, b.HIGH);
      	wait(50);
      	for (i = 0; i < maximumKnocks ; i++){
        	b.digitalWrite(greenLED, b.LOW);
        	b.digitalWrite(redLED, b.LOW);  
        	if (secretCode[i] > 0){                                   
        	  wait( map(secretCode[i],0, 100, 0, maxKnockInterval)); // Expand the time back out to what it was.  Roughly. 
        	  b.digitalWrite(greenLED, b.HIGH);
        	  b.digitalWrite(redLED, b.HIGH);
        	}
        	wait(50);
      	}
      	return false;
	}
	if(currentKnockCount!=secretKnockCount){
		return false;
	}
	var totaltimeDifferences=0;
  	var timeDiff=0;
  	for (i=0;i<maximumKnocks;i++){
    	knockReadings[i]= map(knockReadings[i],0, maxKnockInterval, 0, 100);      
    	timeDiff = Math.abs(knockReadings[i]-secretCode[i]);
    	if (timeDiff > rejectValue){
    	  return false;
    	}
    	totaltimeDifferences += timeDiff;
  	}
  	if (totaltimeDifferences/secretKnockCount>averageRejectValue){
    	return false; 
  	}
  
  return true;

}

var x;
var in_min;
var in_max;
var out_min;
var out_max

function map(x, in_min, in_max, out_min, out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}