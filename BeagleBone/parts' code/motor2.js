var b=require('bonescript');


/*
pin1: GRN
pin2: 3.3V
pin3: P9_21 (PWM mode)
*/
var motor = 'P9_21',
    freq = 50,
    ms = 50,
    pos = 2.0,
    step = 2.0;
var delay = 3000;   
var check = 0;
b.pinMode(motor, b.ANALOG_OUTPUT);

move(pos);

setInterval(sweep, ms);


function sweep(){
    if(check == 0 )
    {
        pos = 0.2;
    }
    else{
        pos = 2.0; 
    }
    move(pos);
    check = (check + 1)%2;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function move(pos){
    var dutyCycle = pos/1000*freq;
    b.analogWrite(motor, dutyCycle, freq);
    console.log('pos= ' + pos + ' duty cycle= ' + dutyCycle);
    wait(1000);
}

