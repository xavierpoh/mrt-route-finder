export default class Node {
  constructor(value, edges = [], searched = false, parent = null) {
    this.value = value;
    this.edges = edges;
    this.searched = searched;
    this.parent = parent;

    this.addEdge = (neighbour) => {
      this.edges.push(neighbour);
      neighbour.edges.push(this);
    }
  }
}