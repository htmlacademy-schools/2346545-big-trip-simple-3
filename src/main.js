import { render } from './render.js';
import FilterView from './view/view-filter.js';
import BoardPresenter from './presenter/board-presenter.js';

const filterConteiner = document.querySelector('.trip-controls__filters');
render(new FilterView, filterConteiner);

const pageContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({ boardContainer: pageContainer });

boardPresenter.init();
