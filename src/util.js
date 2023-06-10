import dayjs from 'dayjs';
import { FilterType } from './const';

const BASIC_DATE_FORMAT = 'DD/MM/YY HH:mm';
const EVENT_DATE_FORMAT = 'MMM D';
const FORM_DATE_FORMAT = 'DD/MM/YY';
const TIME_FORMAT = 'H:mm';

const getRandElement = (item) => item[Math.floor(Math.random() * item.length)];
const getRandID = () => Math.floor(Math.random() * 100) + 1;
const getRandPicture = () => `http://picsum.photos/248/152?r=${getRandID()}`;
const getRandPrice = () => Math.floor(Math.random() * 1000) + 11;

const isDateToToday = (tripPoint) => tripPoint.dateTo && dayjs().isBefore(tripPoint.dateTo, 'D');
const isEscapeKey = (evt) => evt.key === 'Escape';

const convertToBasicFormat = (date) => dayjs(date).format(BASIC_DATE_FORMAT);
const convertToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const convertToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const convertToDateTime = (date) => date.substring(0, date.lastIndexOf('.'));
const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
const convertToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);
const convertToFormDate = (date) => dayjs(date).format(FORM_DATE_FORMAT);

const filter = {
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isDateToToday(tripPoint)),
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints
};

const sortByDay = (A, B) => (dayjs(A.dateFrom).diff(dayjs(B.dateFrom)));

const sortByTime = (A, B) => {
  const timeA = dayjs(A.dateTo).diff(dayjs(A.dateFrom));
  const timeB = dayjs(B.dateTo).diff(dayjs(B.dateFrom));
  return timeB - timeA;
};

const sortByPrice = (A, B) => (B.basePrice - A.basePrice);

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export { convertToBasicFormat, convertToDateTime, convertToEventDate, convertToEventDateTime, convertToFormDate, convertToTime, convertToUpperCase, filter, getRandElement, getRandID, getRandPicture, getRandPrice, isEscapeKey, sortByDay, sortByPrice, sortByTime, updateItem };
