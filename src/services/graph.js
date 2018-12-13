export default function Graph () {
  this.nodes = [];
  this.graph = {};
  this.start = null;
  this.end = null;
}

Graph.prototype.addNode = function (node) {
  this.nodes.push(node);
  let stationName = node.value;
  this.graph[stationName] = node;
}

Graph.prototype.getNode = function (stationName) {
  return this.graph[stationName];
}

Graph.prototype.setStart = function (stationName) {
  this.start = this.graph[stationName];
  return this.start;
}

Graph.prototype.setEnd = function (stationName) {
  this.end = this.graph[stationName];
  return this.end;
}

Graph.prototype.reset = function () {
  this.nodes.forEach(node => {
    node.searched = false;
    node.parent = null;
  })
}