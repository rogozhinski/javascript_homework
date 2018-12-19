const graphFile = require('./graph_functions.js');

class LazyGraph extends graphFile.Graph {

    constructor (graphInput, vertex) {
        super(graphInput, vertex);
        this.sequence = this.mergeBranches (this.map, this.calulTree(this.map, this.vertex));
    }

    // возвращает объект со значениями всех вершин, которые пришлось преодолеть
    valuesGenerator () {

        // подставляет значения в вершины графа согласно общей ветке
        function valuesGeneratorRecursion(map, graph, sequence, step, values) {
            let vertex = sequence[step];
            if (map[vertex] === null) {values[vertex] = graph[vertex]()}
            else{
                let argArray = []
                for (let argCounter in map[vertex]) {
                    argArray.push(values[map[vertex][argCounter]])
                }
                values[vertex] = graph[vertex].apply(this, argArray)
            }
            if (step == 0) {return 1}
            else {step--}
            valuesGeneratorRecursion(map, graph, sequence, step, values)
        }   

        let values = {};
        let step = this.sequence.length - 1;
        
        valuesGeneratorRecursion (this.map, this.graphInput, this.sequence, step, values)
        return values;
    }

    // возвращает определенную вершину графа
    evalGraph(){
        return this.valuesGenerator(this.graph, this.map, this.sequence)[this.vertex]
    }
}

module.exports.LazyGraph = LazyGraph;