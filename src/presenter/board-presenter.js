import NoPointsView from '../view/view-no-point';
import RedactingFormView from '../view/view-redacting_form';
import PointView from '../view/view-point';
import PointListView from '../view/view-point_list';
import SortingView from '../view/view-sorting';
import { render } from '../render';

export default class BoardPresenter {
  #boardContainer = null;
  #points = null;
  #pointListComponent = new PointListView();
  #pointsModel = null;


  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    if(this.#points.length === 0) {
      render(new NoPointsView(), this.#boardContainer);
    }
    else{
      render(new SortingView(), this.#boardContainer);
      render(this.#pointListComponent, this.#boardContainer);
      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i]);
      }
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const pointEditComponent = new RedactingFormView(point);

    const closeFormOnEscape = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        // eslint-disable-next-line no-use-before-define
        replaceFormToPoint();
      }
    };

    const replaceFormToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
      document.body.addEventListener('keydown', closeFormOnEscape());
    };

    const replacePointToForm = () => {
      this.#pointListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
      document.body.removeEventListener('keydown', closeFormOnEscape());
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replacePointToForm();
      document.body.addEventListener('keydown', closeFormOnEscape());
    });

    pointEditComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeFormOnEscape());
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.body.removeEventListener('keydown', closeFormOnEscape());
    });

    render(pointComponent, this.#pointListComponent.element);
  };
}
