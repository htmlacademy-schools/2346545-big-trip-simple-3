import { render } from '../render';
import CreationFormView from '../view/view-creation_form';
import PointView from '../view/view-point';
import PointListView from '../view/view-point_list';
import RedactingFormView from '../view/view-redacting_form';
import SortingView from '../view/view-sorting';

export default class BoardPresenter {
  pointListComponent = new PointListView();

  constructor({ boardContainer }) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortingView(), this.boardContainer);
    render(this.pointListComponent, this.boardContainer);
    render(new CreationFormView(), this.pointListComponent.getElement());
    render(new PointView(), this.pointListComponent.getElement());
    render(new RedactingFormView(), this.pointListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
