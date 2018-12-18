export default class Graph {
  constructor(nodes = [], graph = {}, start = null, end = null) {
    this.nodes = nodes;
    this.graph = graph;
    this.start = start;
    this.end = end;

    this.addNode = (node) => {
      this.nodes.push(node);
      let stationName = node.value;
      this.graph[stationName] = node;
    }

    this.getNode = (stationName) => this.graph[stationName];

    this.setStart = (stationName) => {
      this.start = this.graph[stationName];
      return this.start;
    }

    this.setEnd = (stationName) => {
      this.end = this.graph[stationName];
      return this.end;
    }

    this.reset = () => {
      this.nodes.forEach(node => {
        node.searched = false;
        node.parent = null;
      });
    }
  }
}