import { getRandElement, getRandID, getRandPrice } from '../util';
import { dates, getArrayFromType, pointTypes } from './data';
import { getRandDestination } from './destination';

const pointsId = [];

const getRandPoint = () => {
  let id = getRandID();
  while (pointsId.indexOf(id) >= 0) {
    id = getRandID();
  }
  pointsId.push(id);
  const basePrice = getRandPrice();
  const dateList = getRandElement(dates);
  const dateFrom = dateList.dateFrom;
  const dateTo = dateList.dateTo;
  const destination = getRandDestination();
  const type = getRandElement(pointTypes);
  const offers = getArrayFromType(type);
  return {
    basePrice, dateFrom, dateTo, destination, id, offers, type
  };
};

export { getRandPoint };
