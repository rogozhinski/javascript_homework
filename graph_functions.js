const utilsFile = require('./utils.js');

class Graph {

    constructor (graphInput, vertex) {
        this.graphInput = graphInput;
        this.vertex = vertex;
        this.map = undefined;
    }

    // парсит входящий граф на пары "вершина-аргументы"
    graphMap() {
        let map = {};
        for(let vertex in this.graphInput) {
            let regExp = /\(([^)]+)\)/;
            let matches = regExp.exec(this.graphInput[vertex].toString());
            if (matches != null) {
                let argsList = matches[1].split(',');
                for(let arg in argsList) {argsList[arg] = argsList[arg].replace(' ','')}
                map[vertex] = argsList
                }
            else {map[vertex] = null}
        }
        this.map = map
        return map;
    }

    // для выбранной вершины возвращает набор веток, идущих по графу от этой вершины
    // до известных вершин
    calulTree(){

        if(this.map == undefined) {this.map = this.graphMap()} 
        
        // для выбранной вершины реккурентно находит ветки, идущие по графу от этой вершины
        // до известных вершин, а также находит зацикленности
        function calulTreeRecursion(map, currentVertex, currentPath, branches){
            if (currentPath.indexOf(currentVertex) != -1){throw ('Осторожно! Циклический граф!')}
            currentPath.push(currentVertex);
            if ((map[currentVertex] === null) || (utilsFile.isContains(Object.keys(map), map[currentVertex]) === false))
            {branches.push(currentPath.slice())}
            else{
                for (let counter in map[currentVertex]){
                    let loopVertex = map[currentVertex][counter];
                    let recursionRes = calulTreeRecursion(map, loopVertex, currentPath, branches)
                    if (recursionRes != undefined){branches = recursionRes}
                    currentPath.pop(loopVertex)
                }
            }
            return branches

        } 
        let currentPath = [];
        let branches = [];
        calulTreeRecursion(this.map, this.vertex, currentPath, branches);

        //проверка, есть ли в графе известные вершины
        let hasValues = false;
        for (let key in this.map){if (this.map[key] === null) { hasValues = true}}
        if (hasValues === false) {throw ('В графе нет известных независимых вершин: вычисления невозможны')}

        return branches
    }

    // объединяет ветки в одну общую в правильном порядке
    mergeBranches(){
        let branches = this.calulTree();

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
                if (utilsFile.isContains(verteces, argList) === true){
                    let cacheVertex = commonBranch[vertexCounter];
                    commonBranch[vertexCounter] = commonBranch[currentSeparator];
                    commonBranch[currentSeparator] = cacheVertex;
                    currentSeparator--; 
                }
            }
            mergeBranchesRecursion(map, commonBranch, currentSeparator)
        }

        // вперва уносит в конце общей ветки известные независимые величины
        let commonBranch = [];
        for (let branchCounter in branches) {commonBranch = [...new Set([...commonBranch,...branches[branchCounter]])]}
        let separator = commonBranch.length-1;
        for (let vertexCounter = commonBranch.length-1; vertexCounter>0; vertexCounter--){
            if (this.map[commonBranch[vertexCounter]] === null){
                let cacheVertex = commonBranch[vertexCounter];
                commonBranch[vertexCounter] = commonBranch[separator];
                commonBranch[separator] = cacheVertex;
                separator--;
            }
        }
        // запуск рекурсвных вычислений
        mergeBranchesRecursion(this.map, commonBranch, separator);
        return commonBranch
    }
};

//импорт
module.exports.Graph = Graph;