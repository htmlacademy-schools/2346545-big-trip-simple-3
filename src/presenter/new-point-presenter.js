import RedactingFormView from '../view/view-redacting_form.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';

export default class NewPointPresenter {
  #handleDataChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;
  #pointListContainer = null;

  constructor({ pointListContainer, onDataChange, onDestroy }) {
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointListContainer = pointListContainer;
  }

  init(offers, destinations) {
    if (this.#pointEditComponent !== null) { return; }

    this.#pointEditComponent = new RedactingFormView({
      destinations: destinations,
      offers: offers,
      onDeleteClick: this.#handleDeleteClick,
      onFormSubmit: this.#handleFormSubmit
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #deleteId = (point) => {
    delete point.id;
    return point;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,

      this.#deleteId(point)
    );
  };

  destroy() {
    if (this.#pointEditComponent === null) { return; }

    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }
}
