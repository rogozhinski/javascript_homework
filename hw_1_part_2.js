{let store = 0;
function sum(a) { 
    store += a;
    sum.toString = function() {return store}; 
    sum.valueOf = function() {return store}; 
    return sum;
}
}
