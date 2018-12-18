import { stations, lines } from './mrt.json';
import Graph from './../services/graph';
import Node from './../services/node';

export default function findRoutes(originStation, destinationStation) {
	const MRTLRTGraph = buildGraph();

	// reset searched to false
	MRTLRTGraph.reset();

	// *** Breadth-First-Search Method ***
	let start = MRTLRTGraph.setStart(originStation);
	let end = MRTLRTGraph.setEnd(destinationStation);

	let queue = [];

	start.searched = true;
	queue.push(start);

	while (queue.length) {
		let current = queue.shift();

	// end station has been found
		if(current === end) {
			break;
		}

		let edges = current.edges;
		edges.forEach(edge => {
			let neighbour = edge;
			if (!neighbour.searched) {
				neighbour.searched = true;
				neighbour.parent = current;
				queue.push(neighbour);
			}
		})
	}

	let route = [];
	route.push(end);
	let next = end.parent;
	while (next !== null) {
		route.push(next);
		next = next.parent;
	}
	
	let suggestedSteps = [];
	
	const allLines = getAllLines();
	const allLinesNames = allLines.map(line => line.name.replace(/ /g, '_').toLowerCase());
	const lineCodes = Object.keys(lines);
	const lineColours = lineCodes.map(code => {
		return lines[code].color;
	});

	/*
	Map line code and colour to line name
	{ "circle_line": {
		colour: "#90",
		line_code: "CC"
	}}
	*/
	const lineMapping = {};
	allLinesNames.forEach((lineName, index) => {
		let key = lineName;
		lineMapping[key] = {
			colour: lineColours[index],
			line_code: lineCodes[index]
		}
	});

	let suggestedStations = [];
	let suggestedLines = [];
	let suggestedStops = [];

	for (let i = route.length - 1; i >= 0; i--) {
		let step = route[i].value;
		suggestedSteps.push(step);
	}

	
	suggestedSteps.forEach(step => {
		if(allLinesNames.includes(step)) {
			suggestedLines.push(step);
		} else {
			suggestedStations.push(step);
		}
	})
	
	suggestedLines.forEach((line, index) => {
		let key = line;
		let startStation = suggestedStations[index];
		let endStation = suggestedStations[index + 1];
		suggestedStops.push(getNumberOfStops(lineMapping[key].line_code, startStation, endStation));
	})

	let suggestedRoute = [];
	suggestedLines.forEach((line, index) => {
		let singleLineRoute = {
			from: suggestedStations[index].replace(/_/g, ' '),
			to: suggestedStations[index + 1].replace(/_/g, ' '),
			stops: suggestedStops[index],
			line_code: lineMapping[line].line_code,
			line_name: line.replace(/_/g, ' '),
			colour: lineMapping[line].colour
		};
		suggestedRoute.push(singleLineRoute);
	});
	
	return suggestedRoute;
}

// get number of stops between start and end stations
export function getNumberOfStops(lineCode, startStation, endStation) {
	return Math.abs(lines[lineCode].route.indexOf(endStation) - lines[lineCode].route.indexOf(startStation));
}

// get a nested array of all MRT and LRT lines
export function getAllLines() {
	const allLines = [];

	for (let key in lines) {
		allLines.push(lines[key]);
	}

	return allLines;
}

/*
build graph where node is either a station or a line
edges of stations are lines which they are on
edges of lines are stations which they contain
*/
export function buildGraph() {
	const allLines = getAllLines();
	const graph = new Graph();

	allLines.forEach(line => {
		let lineName = line.name.replace(/ /g, '_').toLowerCase();
		let stations = line.route;
		let lineNode = new Node(lineName);

		graph.addNode(lineNode);

		stations.forEach(station => {
			
			let stationNode = graph.getNode(station);
			if (stationNode === undefined) {
				stationNode = new Node(station);
			}
			graph.addNode(stationNode);
			lineNode.addEdge(stationNode);
		})
	});
	return graph;
}

// returns alphabetically-sorted array of all stations names
export function getAllStations() {
	let stationsList = Object.keys(stations);
	stationsList.sort((a, b) => a.localeCompare(b));
	return stationsList;
}
