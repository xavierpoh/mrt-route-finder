import { stations, lines } from './mrt.json';
// const Graph = require('node-all-paths');
// import Graph from 'node-all-paths';
import Graph from './../services/graph';
import Node from './../services/node';

// TODO: find a way to calculate nearest MRT station by comparing (origin, destination) params to {lat, lng} values in mrt.json stations obj
// TODO: first result will be {type: "walk"}, check if there is direct MRT line from origin to destination
// TODO: if not, find out interchange station. For eg, origin station on CC line, destination station on DT line, find CC-DT interchange
// TODO: calculate number of stops by finding difference of array position of stations

/*
	Returns the best routes between the origin and destination.

	Arguments origin and destination are { lat, lng } objects.
	Returns an array of the best routes. You may define "best" using any reasonable metric and document your definition.

	Each route is an object which must contain a "steps" array. You may add additional properties as needed.
	Each step can represent a "walk", "ride" or "change", and must have at least the following properties:
	- { type: "walk", from: <stationId> or "origin", to: <stationId> or "destination" }
	- { type: "ride", line: <lineId>, from: <stationId>, to: <stationId> }
	- { type: "change", station: <stationId>, from: <lineId>, to: <lineId> }
	You may add additional properties as needed.

	Example:

	findRoutes({ lat: 1.322522, lng: 103.815403 }, { lat: 1.29321, lng: 103.852216 })

	should return something like:

	[
		{ steps: [
			{ type: "walk", from: "origin", to: "botanic_gardens" },
			{ type: "ride", line: "CC", from: "botanic_gardens", to: "buona_vista" },
			{ type: "change", station: "buona_vista", from: "CC", to: "EW" },
			{ type: "ride", line: "EW", from: "buona_vista", to: "bugis" },
			{ type: "walk", from: "bugis", to: "destination" }
		] },
		{ steps: [
			// worse route
		] }
	]

*/

export default function findRoutes(origin, destination) {
	// const originStation = getClosestStation(origin);
	// const destinationStation = getClosestStation(destination);

	const originStation = 'tampines';
	const destinationStation = 'dhoby_ghaut';

	const graph = buildGraph();
	
	console.log('graph: ', graph);

	let routes = [];

	if (originStation === destinationStation) {
		console.log('nearest MRT station is same, just walk!');
	}

	if (graph.hasOwnProperty(originStation)) {
		// graph[originStation].adjacent_to
	}


	// *** BFS METHOD ***
	// console.log('originStation: ', originStation);
	// console.log('destinationStation: ', destinationStation);
	// MRTLRTGraph.reset();

	// let start = MRTLRTGraph.setStart(originStation);	// dhoby ghaut
	// let end = MRTLRTGraph.setEnd(destinationStation);	// king albert park

	// let queue = [];

	// start.searched = true;
	// queue.push(start);	// [dhoby_ghaut]

	// while (queue.length) {
	// 	let current = queue.shift();	// dhoby_ghaut node
	// 	console.log('current.value: ', current.value);
	// 	if(current === end) {
	// 		console.log('Found ' + current.value);
	// 		break;
	// 	}
	// 	let edges = current.edges;
	// 	console.log('edges: ', edges);
	// 	edges.forEach((edge, index) => {
	// 		let neighbour = edge;
	// 		console.log('edge: ', edge);
	// 		if (!neighbour.searched) {
	// 			console.log(`********* ${neighbour.value} not searched and pushing to queue *********`);
	// 			neighbour.searched = true;
	// 			neighbour.parent = current;
	// 			queue.push(neighbour);
	// 		} else {
	// 			console.log(`######### ${neighbour.value} was searched before and not pushed to queue #########`);
	// 		}
	// 	})
	// }

	// let route = [];
	// route.push(end);
	// let next = end.parent;
	// while (next !== null) {
	// 	route.push(next);
	// 	next = next.parent;
	// }

	// let text = '';
	// for (let i = route.length - 1; i >= 0; i--) {
	// 	let step = route[i];
	// 	text += (i === 0) ? step.value : step.value + ' -> ';
	// }

	// console.log('text: ', text);

	return [ { steps: [
		{ type: 'walk', from: 'origin', to: 'destination' }
	] } ];
}

export function getClosestStation(coordinates) {
	// const stationsKeysList = Object.keys(stations);
	let stationsList = [];

	Object.keys(stations).forEach(key => {
		stationsList.push(stations[key]);
	})

	// loop through stationsList to compare distance between user input and station in list
	// save distance somewhere, if distance of next station is shorter, then replace distance var with the new one
	// replace closest station with new value also
	let closestStationIndex = 0;
	let closestStation = stationsList[0];
	let distance = getDistance(coordinates, { lat: closestStation.lat, lng: closestStation.lng });

	stationsList.forEach((station, index) => {
		if (getDistance(coordinates, { lat: station.lat, lng: station.lng }) < distance) {
			closestStationIndex = index;
			closestStation = stationsList[index];
			distance = getDistance(coordinates, { lat: station.lat, lng: station.lng })
		}
	})
	return closestStation.name.replace(/ /g, '_').toLowerCase();
}

// function takes in {lat, lng} of 2 coords and returns the distance in km
export function getDistance(inputCoords, stationCoords) {
	// calculate distance using Haversine formula

	let R = 6371; // Radius of earth in km
	let dLat = degreesToRadian(stationCoords.lat - inputCoords.lat);
	let dLon = degreesToRadian(stationCoords.lng - inputCoords.lng);
	let lat1 = degreesToRadian(inputCoords.lat);
	let lat2 = degreesToRadian(stationCoords.lat);

	let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c;
	return d;
}

// function converts numeric degrees to radians
export function degreesToRadian(value) {
	return value * Math.PI / 180;
}

// get a nested array of all MRT and LRT lines
export function getAllLines() {
	// const linesArray = Object.keys(lines);
	// let allLines = [];

	// linesArray.forEach(line => {
	// 	allLines.push(lines[line].route);
	// })
	const allLines = [];

	for (let key in lines) {
		allLines.push(lines[key]);
	}
	console.log('allLines: ', allLines);
	return allLines;
}

// Graph of MRT and LRT stations, where each station is a node
// each station will have a value which is an object that contains stations adjacent to it
// *** BFS METHOD ***
// export function buildGraph() {
// 	const allLines = getAllLines();
// 	const graph = new Graph();

// 	allLines.forEach(line => {
// 		let lineName = line.name;
// 		let stations = line.route;
// 		let lineNode = new Node(lineName);

// 		graph.addNode(lineNode);

// 		stations.forEach((station, index) => {
			
// 			let stationNode = graph.getNode(station);
// 			if (stationNode === undefined) {
// 				stationNode = new Node(station);
// 			}
// 			graph.addNode(stationNode);
// 			lineNode.addEdge(stationNode);
// 		})
// 	});

// 	console.log('graph: ', graph);

// 	return graph;
// }

export function buildGraph() {
	let linesStations = [];
	let graph = {};
	for (let key in lines) {
		linesStations.push(lines[key]['route']);
	}
	linesStations.forEach(line => {
		line.forEach((station, index) => {
			if (!graph.hasOwnProperty(station)) {
				graph[station] = { adjacent_to: [] };
			}
			let previousStation = line[index - 1];
			let nextStation = line[index + 1];
			if(previousStation !== undefined && !graph[station].adjacent_to.includes[previousStation]) {
				graph[station].adjacent_to.push(previousStation);
			}
			if(nextStation !== undefined && !graph[station].adjacent_to.includes[nextStation]) {
				graph[station].adjacent_to.push(nextStation);
			}
		})
	})

	return graph;
}
