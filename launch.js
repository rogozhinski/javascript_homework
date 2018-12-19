const LazyGraphFile = require('./lazy_graph');
const EagerGraphFile = require('./eager_graph');

// вставьте граф

// const myAmazingGraph = {
//     n: (xs) => xs.length,
//     m: (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
//     m2: (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
//     v: (m, m2) => m*m - m2,
//     xs: () => [1, 2, 3]
//    }

// const myAmazingGraph = {
//     n: (a) => a,  
//     b: (n) => n,
//     z: (x) => x,
//     x: (z) => z,
//    }

// выберите вершину (для ленивого графа)

const vertex = 'a';


// ленивый граф
let myLazyGraph = new LazyGraphFile.LazyGraph (myAmazingGraph, vertex)
console.log('Значение вершины ', vertex, ' равно', myLazyGraph.evalGraph())

// проворный граф
// let myEagerGraph = new EagerGraphFile.EagerGraph (myAmazingGraph)
// console.log('Список вершин графа:', myEagerGraph.evalGraph())