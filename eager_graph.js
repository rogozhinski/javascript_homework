const graphFile = require('./graph_functions.js');

class EagerGraph extends graphFile.Graph {

    constructor (graph) {
        super(graph, vertex);
        this.sequence = this.mergeBranches (this.map, this.calulTree(this.map, this.vertex));
    }

    // возвращает объект со значениями всех вершин, которые пришлось преодолеть
    // каждая вершина считается только единожды
    valuesGenerator () {

        // подставляет значения в вершины графа согласно общей ветке
        function valuesGeneratorRecursion(step, values) {
            let vertex = this.sequence[step];
            if (Object.keys(values).indexOf(vertex) === -1) {
                if (this.map[vertex] === null) {values[vertex] = this.graph[vertex]()}
                else{
                    let argArray = []
                    for (let argCounter in this.map[vertex]) {
                        argArray.push(values[this.map[vertex][argCounter]])
                    }
                    values[vertex] = this.graph[vertex].apply(this, argArray)
                }
            }
            if (step === 0) {return 1}
            else {step--}
            valuesGeneratorRecursion(step, values)
        }   

        let values = {};
        let verteces = Object.keys(this.map);
        for (let vertexCounter in verteces) {
            let targetVertex = verteces [vertexCounter];
            let sequence = this.mergeBranches (this.map, this.calulTree(this.map, targetVertex));
            let step = this.sequence.length - 1;
            valuesGeneratorRecursion (step, values)
        }
        return values;
    }

    // возвращает определенную вершину графа
    evalGraph(){
        return this.valuesGenerator(this.graph, this.map, this.sequence)
    }
}

module.exports.EagerGraph = EagerGraph;