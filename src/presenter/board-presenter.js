import PointListView from '../view/view-point_list';
import PointPresenter from './travel-point-presenter';
import SortingView from '../view/view-sorting';
import { render, RenderPosition } from '../framework/render';
import { SortType } from '../const';
import { sortByDay, sortByTime } from '../util';

export default class BoardPresenter {
  #boardContainer = null;
  #currentSortType = SortType.DAY;
  #noPointComponent = null;
  #points = null;
  #pointsListComponent = new PointListView();
  #pointsModel = null;
  #pointPresenter = new Map();
  #sortComponent = null;
  #sourcedPoints = [];

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      render(this.#renderNoPoints, this.#boardContainer);
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointsList() {
    render(this.#pointsListComponent, this.#boardContainer);
    this.#renderPoints();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointsList() {
    this.#pointPresenter.forEach((presenter) => presenter.removePoint());
    this.#pointPresenter.clear();
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case 'sort-day':
        this.#points.sort(sortByDay);
        break;
      case 'sort-time':
        this.#points.sort(sortByTime);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    this.#sortPoints('sort-day');
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }
}
