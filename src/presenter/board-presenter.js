import NoPointsView from '../view/view-no-point';
import RedactingFormView from '../view/view-redacting_form';
import PointView from '../view/view-point';
import PointListView from '../view/view-point_list';
import SortingView from '../view/view-sorting';
import { render, replace } from '../framework/render';

export default class BoardPresenter {
  #boardContainer = null;
  #pointListComponent = new PointListView();
  #pointsModel = null;


  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = [...this.#pointsModel.points];
    if (points.length === 0) {
      render(new NoPointsView(), this.#boardContainer);
    }
    else {
      render(new SortingView(), this.#boardContainer);
      render(this.#pointListComponent, this.#boardContainer);
      for (let i = 0; i < points.length; i++) {
        this.#renderPoint(points[i]);
      }
    }
  }

  #renderPoint = (point) => {

    const ecsKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        // eslint-disable-next-line no-use-before-define
        replaceFormToPoint();
        document.body.removeEventListener('keydown', ecsKeyDown);
      }
    };

    const pointComponent = new PointView({
      point: point,
      onEditClick: () => {
        // eslint-disable-next-line no-use-before-define
        replacePointToForm.call(this);
        document.body.addEventListener('keydown', ecsKeyDown);
      }
    }
    );

    const redactingFormComponent = new RedactingFormView({
      point: point,
      onFormSubmit: () => {
        // eslint-disable-next-line no-use-before-define
        replaceFormToPoint.call(this);
        document.body.removeEventListener('keydown', ecsKeyDown);
      }
    });

    const replaceFormToPoint = () => {
      replace(pointComponent, redactingFormComponent);
    };

    const replacePointToForm = () => {
      replace(redactingFormComponent, pointComponent);
    };

    render(pointComponent, this.#pointListComponent.element);
  };
}
