import { Coordinate } from './Coordinates';

export default class GameResult {
  created: Date;
  coord: Coordinate;
  address: string;

  constructor(coord: Coordinate, address: string, created: Date = new Date()) {
    this.coord = coord;
    this.address = address;
    this.created = created;
  }

  fromJSON(jsonString: string) {
    const obj = JSON.parse(jsonString);
    this.created = new Date(obj.created);
    this.coord = obj.coord;
    this.address = obj.address;
  }

  toObjectData(): object {
    return {
      created: this.created,
      coord: this.coord,
      address: this.address,
    };
  }
}

// Example usage:
// const gameResult = new GameResult(100)
// const jsonString = gameResult.toJSON()
// localStorage.setItem('gameResult', jsonString)

// const storedJsonString = localStorage.getItem('gameResult')
// if (storedJsonString) {
//     const loadedGameResult = GameResult.fromJSON(storedJsonString)
//     console.log(loadedGameResult)
// }
