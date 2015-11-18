var b=require('bonescript');

/*
pin1: GRN
pin2: P9_40 (Analog)
*/

var pin = 'P9_40';

setInterval(fun, 300);

function fun(){
    b.analogRead(pin, printAIN1);
}

function printAIN1(x) {
    console.log('x.value = ' + x.value);
    if(x.value>=0.6){
    console.log('knock');
    }
}
