  
// парсит входящий граф на пары "вершина-аргументы"
function graphMap(graphInput) {
    let map = {};
    for(let vertex in graphInput) {
        let regExp = /\(([^)]+)\)/;
        let matches = regExp.exec(graphInput[vertex].toString());
        if (matches != null) {
            argsList = matches[1].split(',');
            for(let arg in argsList) {argsList[arg] = argsList[arg].replace(' ','')}
            map[vertex] = argsList
            }
        else {map[vertex] = null}
    }
    return map;
}

// для выбранной вершины возвращает набор веток, идущих по графу от этой вершины
// до известных вершин
function calulTree(map, vertex){

    //проверка, есть ли в графе известные вершины 
    let hasValues = false;
    for (key in map){
        if (map[key] == null) { hasValues = true}
    }
    if (hasValues == false) {throw ('В графе нет известных независимых вершин: вычисления невозможны')}

    // для выбранной вершины реккурентно находит ветки, идущие по графу от этой вершины
    // до известных вершин, а также находит зацикленности
    function calulTreeRecursion(map, vertex, currentPath, branches){
        if (currentPath.indexOf(vertex) != -1){throw ('Осторожно! Циклический граф!')}
        currentPath.push(vertex);
        if ((map[vertex] == null) || (isContains(Object.keys(map), map[vertex]) == false))
        {branches.push(currentPath.slice())}
        else{
            for (let counter in map[vertex]){
                let currentVertex = map[vertex][counter];
                recursionRes = calulTreeRecursion(map, currentVertex, currentPath, branches)
                if (recursionRes != undefined){branches = recursionRes}
                currentPath.pop(currentVertex)
            }
        }
        return branches
    } 

    let currentPath = [];
    let branches = [];
    calulTreeRecursion(map, vertex, currentPath, branches);
    return branches
}

// проверяет вхождение второго массива в первый
function isContains (container, target){
    for(targetChecker in target){
        if (container.indexOf(target[targetChecker]) == -1) {return false}
    }
    return true    
}

// объединяет ветки в одну общую в правильном порядке
function mergeBranches(map, branches){

    // используется для расстановки вершин общей ветки в правильном порядке,
    // позволяющем вычислить искомую вершину 
    // (рекурсивный алгоритм напоминает алгоритм быстрой сортировки)
    function mergeBranchesRecursion(map, commonBranch, currentSeparator){

        if (currentSeparator < 0) {return true};
        let vertexCounter = currentSeparator;
        let commonBranchBound = commonBranch.length;
        for (vertexCounter; vertexCounter>-1; vertexCounter--) {
            let argList = map[commonBranch[vertexCounter]]
            let verteces = commonBranch.slice(currentSeparator+1, commonBranchBound);
            if (isContains(verteces, argList) == true){
                cacheVertex = commonBranch[vertexCounter];
                commonBranch[vertexCounter] = commonBranch[currentSeparator];
                commonBranch[currentSeparator] = cacheVertex;
                currentSeparator--; 
            }
        }
        mergeBranchesRecursion(map, commonBranch, currentSeparator)
    }

    let commonBranch = [];
    for (branchCounter in branches) {commonBranch = [...new Set([...commonBranch,...branches[branchCounter]])]}
    let separator = commonBranch.length-1;
    for (let vertexCounter=commonBranch.length-1; vertexCounter>0; vertexCounter--){
        if (map[commonBranch[vertexCounter]] == null){
            cacheVertex = commonBranch[vertexCounter];
            commonBranch[vertexCounter] = commonBranch[separator];
            commonBranch[separator] = cacheVertex;
            separator--;
        }
    }

    mergeBranchesRecursion(map, commonBranch, separator);
    return commonBranch
}


//импорт
module.exports.graphMap = graphMap;
module.exports.calulTree = calulTree;
module.exports.mergeBranches = mergeBranches;