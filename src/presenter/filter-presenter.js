import FilterView from '../view/view-filter.js';
import { remove, render, replace } from '../framework/render.js';
import { FilterType, FilterTypeDescriptions, UpdateType } from '../const.js';
import { filter } from '../util.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [FilterType.EVERYTHING, FilterType.FUTURE].map((type) => ({ type, name: FilterTypeDescriptions[type], count: filter[type](this.#pointsModel.points).length }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) { return; }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => { this.init(); };
}
