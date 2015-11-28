/********************
# Automatic-Door-Lock-System

Team:
Anand K Parmar (B12021)
Mani Kumar (B12012)
Shiva Verma (B13228)
Srinath MR (B12035)
**********************/

var b=require('bonescript');

/******************************************/

/*
pin1: GRN
pin2: P9_40 (Analog sensor)
*/
var sensor = 'P9_40';

/*
pin1: GRN
pin2: 3.3V
pin3: P9_21 (PWM mode)
*/
var motor = 'P9_21';
var freq = 50;
var pos = 2.0;
var delay = 1000;  // 
var check = 0; // 0=close 1=open


var button = "P8_26";
var button_modify = "P9_15";

var led_red = "P8_10";
var led_Green = "P8_18";

var ms = 100;
/******************************************/
b.pinMode(button, b.INPUT);
b.pinMode(button_modify, b.INPUT);
b.pinMode(led_red, b.OUTPUT);
b.pinMode(led_Green, b.OUTPUT);
b.pinMode(motor, b.ANALOG_OUTPUT);


/******************************************/
move(pos);
setInterval(fun, ms);

function fun()
{
    b.analogRead(sensor, printAIN1);
    b.digitalRead(button, checkButton);
}

function wait(ms)
{
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) 
    {
        end = new Date().getTime();
    }
}

/******************************************/
function printAIN1(x) 
{
    console.log('x.value = ' + x.value);
    if(x.value>=0.6)
    {
        console.log('___________knock__________');
        blink(1);
        check = 1;
        sweep();
    }
}

function checkButton(x) 
{
    if(x.value == 1)
    {
        check = 0;
        sweep();
    }
}

function sweep(){
    if(check == 0 )
    {
        pos = 2.0;
    }
    else
    {
        pos = 0.2; 
    }
    move(pos);
}

function move(pos){
    var dutyCycle = pos/1000*freq;
    b.analogWrite(motor, dutyCycle, freq);
    console.log('pos= ' + pos + ' duty cycle= ' + dutyCycle);
    wait(delay);
}

function blink(x){
    if(x==1)
    {
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        /*
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_Green, b.HIGH);
        wait(50);
        b.digitalWrite(led_Green, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        */
    }
    else
    {
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
        wait(50);
        b.digitalWrite(led_red, b.HIGH);
        wait(50);
        b.digitalWrite(led_red, b.LOW);
    }
}

/******************************************/