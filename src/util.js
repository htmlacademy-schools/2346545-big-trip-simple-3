import dayjs from 'dayjs';
import { FilterType } from './const';
import { offers } from './mock/data.js';

const BASIC_DATE_FORMAT = 'DD/MM/YY HH:mm';
const EVENT_DATE_FORMAT = 'MMM D';
const FORM_DATE_FORMAT = 'DD/MM/YY';
const TIME_FORMAT = 'H:mm';

const convertToBasicFormat = (date) => dayjs(date).format(BASIC_DATE_FORMAT);
const convertToDateTime = (date) => date.substring(0, date.indexOf('.'));
const convertToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const convertToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const convertToFormDate = (date) => dayjs(date).format(FORM_DATE_FORMAT);
const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
const convertToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);

const createOffersTemplate = (currType, checkedOffers, offerId) => {
  const offersList = currType.map((currOffer) => offers.find((offer) => offer.id === currOffer));
  return offersList.map((offer) => {
    const isChecked = checkedOffers.includes(offer.id) ? 'checked' : '';
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').at(-1)}-${offerId}" type="checkbox" name="event-offer-${offer.title.split(' ').at(-1)}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offer.title.split(' ').at(-1)}-${offerId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');
};

const getRandElement = (item) => item[Math.floor(Math.random() * item.length)];
const getRandID = () => Math.floor(Math.random() * 100) + 1;
const getRandPicture = () => `http://picsum.photos/248/152?r=${getRandID()}`;
const getRandPrice = () => Math.floor(Math.random() * 1000) + 11;

const isDateToToday = (point) => dayjs(point.dateFrom).isBefore(dayjs(), 'D') || dayjs(point.dateFrom).isSame(dayjs(), 'D');
const isEscapeKey = (evt) => evt.key === 'Escape';

const sortByDay = (A, B) => (dayjs(A.dateFrom).diff(dayjs(B.dateFrom)));

const sortByTime = (A, B) => {
  const timeA = dayjs(A.dateTo).diff(dayjs(A.dateFrom));
  const timeB = dayjs(B.dateTo).diff(dayjs(B.dateFrom));
  return timeB - timeA;
};

const sortByPrice = (A, B) => (A.basePrice - B.basePrice);

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const filter = {
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isDateToToday(tripPoint.dateFrom)),
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints
};

export { convertToBasicFormat, convertToDateTime, convertToEventDate, convertToEventDateTime, convertToFormDate, convertToTime, convertToUpperCase, createOffersTemplate, filter, getRandElement, getRandID, getRandPicture, getRandPrice, isEscapeKey, sortByDay, sortByPrice, sortByTime, updateItem };
