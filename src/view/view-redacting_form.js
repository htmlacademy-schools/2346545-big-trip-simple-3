import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { destinationsList, getCityNameById } from '../mock/destination';
import { createOffersTemplate, convertToBasicFormat } from '../util';
import { offersByType, pointTypes } from '../mock/data';


const BLANK_POINT = {
  basePrice: 800,
  type: 'flight',
  dateFrom: '2019-07-18T20:20:13.375Z',
  dateTo: '2019-07-18T21:40:13.375Z',
  destination: undefined,
  id: 0,
  offersIDs: [1, 2, 3, 4, 5, 8]
};

function createDestinationPicturesTemplate(destination) {
  const pic = destination.pictures;
  return `
  <img class="event__photo" src="${pic.src}" alt="${pic.description}">
  `;
}

function createDestinationDescriptionTemplate(destination) {
  return (destination) ? `
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${createDestinationPicturesTemplate(destination)}
    </div>
  </div>` : '';
}

const createEventDetailsTemplate = (point, destination) => {
  const currentTypeOffers = point.offers;
  return `
  <section class="event__section  event__section--offers ${(currentTypeOffers.length === 0) ? 'visually-hidden' : ''}" >
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createOffersTemplate(point.currentTypeOffers.map((offer) => offer.id), point.offers, point.id)}
    </div>
  </section>
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    ${createDestinationDescriptionTemplate(destination)}
  </section>`;
};

function generateRollupButton(isEditForm) {
  return (!isEditForm) ? '' : `
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
}

function createEventTypeList(currentType, currentId) {
  return pointTypes.map((type) => `
  <div class="event__type-item">
    <input id="event-type-${type}-${currentId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(type === currentType) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${currentId}">${type}</label>
  </div>`
  ).join('');
}

function createDestinationList(dest) {
  return dest.map((destination) => `
    <option value="${destination.name}"></option>`
  ).join('');
}

const createRedactingFormTemplate = (point, isEditForm) => {
  const currentDestination = destinationsList.find((destination) => destination.name === getCityNameById(point.destination));
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-${point.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="${point.type}">
        </label>
        <input class="event__type-toggle visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeList(point.type, point.id)}
            </fieldset>
        </div>
      </div>
      <div class="event__field-group event__field-group--destination">
        <label class="event__label event__type-output" for="event-destination-${point.id}">
        ${point.type}
        </label>
        <input class="event__input event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-${point.id}">
        <datalist id="destination-list-${point.id}">
          ${createDestinationList(destinationsList)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
        <input class="event__input event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${convertToBasicFormat(point.dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
        <input class="event__input event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${convertToBasicFormat(point.dateTo)}">
      </div>
      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-${point.id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${(isEditForm) ? 'Delete' : 'Cancel'}</button>
      ${generateRollupButton(isEditForm)}
    </header>
    <section class="event__details">
      ${createEventDetailsTemplate(point, currentDestination)}
      </section>
  </form>
  </li>`
  );
};

export default class RedactingFormView extends AbstractStatefulView {
  #fromDatepicker = null;
  #isEditForm = null;
  #toDatepicker = null;

  constructor({ point = BLANK_POINT, onFormSubmit, onRollUpButton, isEditForm = true }) {
    super();
    this.#isEditForm = isEditForm;
    this._callback.onFormSubmit = onFormSubmit;
    this._callback.onRollUpButton = onRollUpButton;
    this._setState(RedactingFormView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createRedactingFormTemplate(this._state, this.#isEditForm);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offersHandler);
    if (this.#isEditForm) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formSubmitHandler);
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonHandler);
      this.#setFromDatePicker();
      this.#setToDatePicker();
    }
  }

  #destinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: destinationsList.find((destination) => destination.name === evt.target.value).id,
    });
  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: offersByType.find((offer) => offer.type === evt.target.value).offers.map((offer) => offer.id),
      currentTypeOffers: offersByType.find((offer) => offer.type === evt.target.value).offers
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.onFormSubmit(RedactingFormView.parseStateToPoint(this._state));
  };

  #fromDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate.toISOString(),
    });
    this.#toDatepicker.set('minDate', userDate);
  };

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = this._state.currentTypeOffers.find((offer) => offer.title.split(' ').at(-1) === evt.target.name.split('-').at(-1)).id;
    const newOffersIds = this._state.offers;

    if (newOffersIds.includes(clickedOfferId)) {
      newOffersIds.splice(newOffersIds.indexOf(clickedOfferId), 1);
    }
    else {
      newOffersIds.push(clickedOfferId);
    }
    this._setState({
      offers: newOffersIds
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #rollUpButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.onRollUpButton();
  };

  #setFromDatePicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertToBasicFormat(this._state.dateFrom),
        onChange: this.#fromDateChangeHandler,
      },
    );
  }

  #setToDatePicker() {
    this.#toDatepicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertToBasicFormat(this._state.dateTo),
        minDate: convertToBasicFormat(this._state.dateFrom),
        onChange: this.#toDateChangeHandler,
      },
    );
  }

  #toDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate.toISOString(),
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
      currentTypeOffers: offersByType.find((offer) => offer.type === point.type).offers
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.currentTypeOffers;
    return point;
  }

  removeElement() {
    super.removeElement();


    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }

    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  reset(point) {
    this.updateElement(
      RedactingFormView.parsePointToState(point),
    );
  }
}
