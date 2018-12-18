import { stations, lines } from './mrt.json';
import findRoutes, { getAllLines, getNumberOfStops, getAllStations } from './findRoutes';

it('should go from origin to destination', () => {
	const results = findRoutes('botanic_gardens', 'tampines');
	const firstStep = results[0];
	expect(firstStep.from).toBe('botanic gardens');
	expect(results[results.length - 1].to).toBe('tampines');
});

it('should get all train lines', () => {
	const allLines = getAllLines();
	expect(allLines.length).toBe(Object.keys(lines).length);
});

it('should return correct number of stops', () => {
	const numberOfStops = getNumberOfStops('NE', 'punggol', 'serangoon');
	const indexOfPunggol = lines['NE'].route.indexOf('punggol');
	const indexOfSerangoon = lines['NE'].route.indexOf('serangoon');
	expect(numberOfStops).toBe(Math.abs(indexOfSerangoon - indexOfPunggol));
});

it('should return array of alphabetically sorted station names', () => {
	const sortedStationList = getAllStations();
	const firstStation = 'admiralty';
	const lastStation = 'yishun';
	expect(sortedStationList[0]).toBe(firstStation);
	expect(sortedStationList[sortedStationList.length - 1]).toBe(lastStation);
})
