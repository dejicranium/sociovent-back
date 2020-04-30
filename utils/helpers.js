
module.exports = {
    convert12hourTime(time, ampm) {
        const locals = {};
        locals.delimited_time = time.split(':');
        locals.hour = parseInt(locals.delimited_time[0]);
        if (ampm.toLowerCase() === 'pm') {
            if (locals.hour > 0) {
                locals.hour += 12;
            }
        }
        else if (locals.hour === 12 ) {
            locals.hour = '00'
        }
        
        locals.time =  locals.hour + ':' +  locals.delimited_time[1] + ':00';

        console.log(locals.time);
        return locals.time;
        
    }
    
}
/*
module.exports.convert12hourTime('1:00:00', 'pm');*/