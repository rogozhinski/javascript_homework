const graphFunctions = require('./graph_functions');

class EagerGraph {

    constructor(graph){
        this.graph = graph;
        this.map = graphFunctions.graphMap (this.graph)
    };

    // возвращает объект со значениями всех вершин, которые пришлось преодолеть
    // каждая вершина считается только единожды
    valuesGenerator (graph, map) {

        // подставляет значения в вершины графа согласно общей ветке
        function valuesGeneratorRecursion(graph, map, sequence, step, values) {
            let vertex = sequence[step];
            if (Object.keys(values).indexOf(vertex) == -1) {
                if (map[vertex]==null) {values[vertex] = graph[vertex]()}
                else{
                    let argArray = []
                    for (let argCounter in map[vertex]) {
                        argArray.push(values[map[vertex][argCounter]])
                    }
                    values[vertex] = graph[vertex].apply(this, argArray)
                }
            }
            if (step == 0) {return 1}
            else {step--}
            valuesGeneratorRecursion(graph, map, sequence, step, values)
        }   

        let values = {};
        let verteces = Object.keys(map);
        for (let vertexCounter in verteces){
            let targetVertex = verteces[vertexCounter];
            let sequence = graphFunctions.mergeBranches (this.map, graphFunctions.calulTree(this.map, targetVertex));
            let step = sequence.length - 1;
            valuesGeneratorRecursion (graph, map, sequence, step, values)
        }
        return values;
    }

    // возвращает определенную вершину графа
    evalGraph(){
        return this.valuesGenerator(this.graph, this.map, this.sequence)
    }
}

module.exports.EagerGraph = EagerGraph;