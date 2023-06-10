import AbstractView from '../framework/view/abstract-view';

const createNoPointsTemplate = (filterType) => {
  if (filterType === 'future') { return '<p class="trip-events__msg">There are no future points now</p>'; }
  else { return '<p class="trip-events__msg">Click New Event to create your first point</p>'; }
};

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor({filterType}){
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
