const graphFunctions = require('./graph_functions');

class LazyGraph {

    constructor(graph, vertex){
        this.graph = graph;
        this.vertex = vertex;
        this.map = graphFunctions.graphMap (this.graph);
        this.sequence = graphFunctions.mergeBranches (this.map, graphFunctions.calulTree(this.map, this.vertex));
    }

    // возвращает объект со значениями всех вершин, которые пришлось преодолеть
    valuesGenerator (graph, map, sequence) {

        // подставляет значения в вершины графа согласно общей ветке
        function valuesGeneratorRecursion(graph, map, sequence, step, values) {
            let vertex = sequence[step];
            if (map[vertex]==null) {values[vertex] = graph[vertex]()}
            else{
                let argArray = []
                for (let argCounter in map[vertex]) {
                    argArray.push(values[map[vertex][argCounter]])
                }
                values[vertex] = graph[vertex].apply(this, argArray)
            }
            if (step == 0) {return 1}
            else {step--}
            valuesGeneratorRecursion(graph, map, sequence, step, values)
        }   

        let values = {};
        let step = sequence.length - 1;
        valuesGeneratorRecursion (graph, map, sequence, step, values)
        return values;
    }

    // возвращает определенную вершину графа
    evalGraph(){
        return this.valuesGenerator(this.graph, this.map, this.sequence)[this.vertex]
    }
}

module.exports.LazyGraph = LazyGraph;