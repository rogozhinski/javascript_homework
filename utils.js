// проверяет вхождение второго массива в первый
function isContains (container, target){
    for(targetChecker in target){
        if (container.indexOf(target[targetChecker]) === -1) {return false}
    }
    return true    
}

module.exports.isContains = isContains;