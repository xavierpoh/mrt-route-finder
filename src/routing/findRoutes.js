import { stations, lines } from './mrt.json';
import Graph from './../services/graph';
import Node from './../services/node';

export default function findRoutes(origin, destination) {
	const originStation = getClosestStation(origin);
	const destinationStation = getClosestStation(destination);

	const MRTLRTGraph = buildGraph();
	/*
	const originStation = 'sengkang';
	const destinationStation = 'serangoon';

	if (origin === destination) {
		console.log('Nearest MRT station is the same, just walk!');
	}

	const graph = buildGraph();
	
	console.log('graph: ', graph);

	let allRoutes = findRoute(originStation, destinationStation);

	console.log('allRoutes: ', allRoutes);
	
	// find single route
	// return the route array if destination is found
	function findRoute(start, end, route = []) {
		console.log('start: ', start);
		console.log('end: ', end);
		console.log('route: ', route);
		let allRoutes = [];

		route = route.slice();
		route.push(start);
		
		if (start === end) {
			return route;
		}

		if (graph.hasOwnProperty(start)) {
			// graph[originStation].adjacent_to
			graph[start].adjacent_to.forEach(neighbour => {
				console.log('neighbour: ', neighbour);
				if (!route.includes(neighbour)) {
					let newRoute = findRoute(neighbour, end, route);
	
					if(newRoute.length !== 0) {
						allRoutes.push(newRoute);
					}
				}
			})
		}

		return allRoutes;
	
	}*/




	// *** BFS METHOD ***
	console.log('originStation: ', originStation);
	console.log('destinationStation: ', destinationStation);
	MRTLRTGraph.reset();

	let start = MRTLRTGraph.setStart(originStation);	// dhoby ghaut
	let end = MRTLRTGraph.setEnd(destinationStation);	// king albert park

	let queue = [];

	start.searched = true;
	queue.push(start);	// [dhoby_ghaut]

	while (queue.length) {
		let current = queue.shift();	// dhoby_ghaut node
		// console.log('current.value: ', current.value);
		if(current === end) {
			// console.log('Found ' + current.value);
			break;
		}
		let edges = current.edges;
		// console.log('edges: ', edges);
		edges.forEach(edge => {
			let neighbour = edge;
			// console.log('edge: ', edge);
			if (!neighbour.searched) {
				// console.log(`********* ${neighbour.value} not searched and pushing to queue *********`);
				neighbour.searched = true;
				neighbour.parent = current;
				queue.push(neighbour);
			} else {
				// console.log(`######### ${neighbour.value} was searched before and not pushed to queue #########`);
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
	
	console.log('suggestedSteps: ', suggestedSteps);
	console.log('suggestedLines: ', suggestedLines);
	console.log('suggestedStations: ', suggestedStations);
	console.log('suggestedStops: ', suggestedStops);

	let suggestedRoute = [];
	suggestedLines.forEach((line, index) => {
		let singleLineRoute = {
			from: suggestedStations[index],
			to: suggestedStations[index + 1],
			stops: suggestedStops[index],
			line_code: lineMapping[line].line_code,
			line_name: line
		};
		suggestedRoute.push(singleLineRoute);
	});

	console.log('suggestedRoute: ', suggestedRoute);

	return suggestedRoute;
}

export function getNumberOfStops(lineCode, startStation, endStation) {
	return Math.abs(lines[lineCode].route.indexOf(endStation) - lines[lineCode].route.indexOf(startStation));
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
	return allLines;
}

// Graph of MRT and LRT stations, where each station is a node
// each station will have a value which is an object that contains stations adjacent to it
// *** BFS METHOD ***
export function buildGraph() {
	const allLines = getAllLines();
	const graph = new Graph();

	allLines.forEach(line => {
		let lineName = line.name.replace(/ /g, '_').toLowerCase();
		let stations = line.route;
		let lineNode = new Node(lineName);

		graph.addNode(lineNode);

		stations.forEach((station, index) => {
			
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

/*
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
}*/
