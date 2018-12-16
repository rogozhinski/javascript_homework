{let store = 0;
function sum(a) { 
    store += a;
    sum.toString = function() {return store}; 
    sum.valueOf = function() {return store}; 
    return sum;
}
}

console.log(sum(3)(4).valueOf());
console.log('cock');

// function sum(a) { 
//     var store = a; 
//     return function (a) { 
//     store += a; 
//     arguments.callee.toString = function() {return store}; 
//     arguments.callee.valueOf = function() {return store}; 
//     return sum; 
//     }
// }