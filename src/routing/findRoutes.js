import { stations, lines } from './mrt.json';
// const Graph = require('node-all-paths');
import Graph from 'node-all-paths';
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
	const originStation = getClosestStation(origin);
	const destinationStation = getClosestStation(destination);

	const MRTLRTGraph = buildGraph();
	
	console.log('originStation: ', originStation);
	console.log('destinationStation: ', destinationStation);
	console.log('MRTLRTGraph: ', MRTLRTGraph);

	console.log(MRTLRTGraph.path('bishan', 'orchard'));

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

	return closestStation.name;
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
	const linesArray = Object.keys(lines);
	let allLines = [];

	linesArray.forEach(line => {
		allLines.push(lines[line].route);
	})

	return allLines;
}

// Graph of MRT and LRT stations, where each station is a node
// each station will have a value which is an object that contains stations adjacent to it
export function buildGraph() {
	const stationsObj = {};
	const allLines = getAllLines();
	const graph = new Graph();

	allLines.forEach(line => {
		line.forEach((station, index) => {
			if (!stationsObj.hasOwnProperty(station)) {
				stationsObj[station] = {};
			}
			if (line[index - 1] !== undefined && !stationsObj[station].hasOwnProperty(line[index - 1])) {
				stationsObj[station][line[index - 1]] = 1;
			}
			if (line[index + 1] !== undefined && !stationsObj[station].hasOwnProperty(line[index + 1])) {
				stationsObj[station][line[index + 1]] = 1;
			}
		})
	});

	for (let key in stationsObj) {
		graph.addNode(key, stationsObj[key]);
	}
	return graph;
}
