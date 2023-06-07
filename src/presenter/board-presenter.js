import { render } from '../render';
import CreationFormView from '../view/view-creation_form';
import PointView from '../view/view-point';
import PointListView from '../view/view-point_list';
import RedactingFormView from '../view/view-redacting_form';
import SortingView from '../view/view-sorting';

export default class BoardPresenter {
  pointListComponent = new PointListView();

  constructor({ boardContainer, pointsModel }) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.points];
    render(new SortingView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    render(new CreationFormView(), this.pointListComponent.getElement());
    render(new RedactingFormView(), this.pointListComponent.getElement());
    for (let i = 0; i < this.points.length; i++) {
      render(new PointView({point: this.points[i]}), this.pointListComponent.element);
    }
  }
}
