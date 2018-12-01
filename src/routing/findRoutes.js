import { stations, lines } from './mrt.json';

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
	return [ { steps: [
		{ type: 'walk', from: 'origin', to: 'destination' }
	] } ];
}
