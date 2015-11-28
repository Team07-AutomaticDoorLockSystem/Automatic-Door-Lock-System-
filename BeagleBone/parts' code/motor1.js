var b=require('bonescript');


/*
pin1: GRN
pin2: 3.3V
pin3: P9_21 (PWM mode)
*/
var motor = 'P9_21',
    freq = 50,
    min = 0.3,
    max = 2.0,
    ms = 50,
    pos = 2.0,
    step = 0.2;
    
b.pinMode(motor, b.ANALOG_OUTPUT, 6, 0, 0, doInterval);

function doInterval(x){
    if(x.err){
        console.log('err: ' + x.err);
        return;
    }
    timer = setInterval(sweep, ms);
}

move(pos);

function sweep(){
    pos += step;
    if(pos>max || pos<min)
    {
        step *= -1;
    }
    move(pos);
}

function move(pos){
    var dutyCycle = pos/1000*freq;
    b.analogWrite(motor, dutyCycle, freq);
    console.log('pos= '+pos+' duty cycle= '+ dutyCycle);
}

process.on('SIGINT', function(){
   console.log('Motor off');
   clearInterval(timer);
   b.analogWrite(motor, 0, freq);
});