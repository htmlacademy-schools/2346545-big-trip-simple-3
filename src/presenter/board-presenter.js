import PointListView from '../view/view-point_list';
import PointPresenter from './travel-point-presenter';
import { render, RenderPosition } from '../framework/render';

export default class BoardPresenter {
  #boardContainer = null;
  #points = null;
  #pointsListComponent = new PointListView();
  #pointsModel = null;
  #pointPresenter = new Map();
  #noPointComponent = null;


  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      render(this.#renderNoPoints, this.#boardContainer);
      return;
    }
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

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }
}
