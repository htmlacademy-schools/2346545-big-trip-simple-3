import dayjs from 'dayjs';
import { FilterType } from './const';
import { getOfferName, getOfferPrice } from './mock/data.js';

const EVENT_DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'H:mm';
const FORM_DATE_FORMAT = 'DD/MM/YY';

const getRandElement = (item) => item[Math.floor(Math.random() * item.length)];
const getRandID = () => Math.floor(Math.random() * 100) + 1;
const getRandPicture = () => `http://picsum.photos/248/152?r=${getRandID()}`;
const getRandPrice = () => Math.floor(Math.random() * 1000) + 11;

const isDateToToday = (point) => dayjs(point.dateFrom).isBefore(dayjs(), 'D') || dayjs(point.dateFrom).isSame(dayjs(), 'D');
const isEscapeKey = (evt) => evt.key === 'Escape';

const convertToEventDateTime = (date) => date.substring(0, date.indexOf('T'));
const convertToEventDate = (date) => dayjs(date).format(EVENT_DATE_FORMAT);
const convertToDateTime = (date) => date.substring(0, date.indexOf('.'));
const convertToTime = (date) => dayjs(date).format(TIME_FORMAT);
const convertToUpperCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);
const convertToFormDate = (date) => dayjs(date).format(FORM_DATE_FORMAT);

const filter = {
  [FilterType.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isDateToToday(tripPoint.dateFrom)),
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints
};

const createOffersTemplate = (offers) => {
  offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer}" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-${offer}">
        <span class="event__offer-title">${getOfferName(offer)}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${getOfferPrice(offer)}</span>
      </label>
    </div>
  `).join('');
};

export { convertToDateTime, convertToEventDate, convertToEventDateTime, convertToFormDate, convertToTime, convertToUpperCase, createOffersTemplate, filter, getRandElement, getRandID, getRandPicture, getRandPrice, isEscapeKey };