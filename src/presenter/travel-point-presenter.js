import { remove, render, replace } from '../framework/render';
import { UserAction, UpdateType } from '../const.js';
import PointView from '../view/view-point';
import RedactingFormView from '../view/view-redacting_form';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #ecsKeyDownHandler = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #point = null;
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  constructor({ pointListContainer, onModeChange, onDataChange }) {
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#pointListContainer = pointListContainer;
  }

  init(point, offers, destinations) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: offers,
      destinations: destinations,
      onEditClick: this.#handleEditClick
    });

    this.#pointEditComponent = new RedactingFormView({
      point: this.#point,
      offers: offers,
      destinations: destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollUpButton: this.#handleRollupButtonClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    this.#pointEditComponent.reset(this.#point);
    document.body.addEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = (this.#point.dateFrom !== update.dateFrom) || (this.#point.basePrice !== update.basePrice);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    document.body.removeEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #handleRollupButtonClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.body.removeEventListener('keydown', this.#ecsKeyDownHandler);
  };

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#pointEditComponent.shake(resetFormState);
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }
}
