import { getRandPoint } from '../mock/point';

const POINT_COUNT = 3;

export default class PointModel {
  #points = Array.from({length: POINT_COUNT}, getRandPoint);

  get points() {
    return this.#points;
  }
}
