import { render } from './framework/render';
import BoardPresenter from './presenter/board-presenter';
import FilterView from './view/view-filter';
import PointsModel from './model/point-model';
import { generateFilter } from './mock/filter.js';

const pageContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({ boardContainer: pageContainer, pointsModel });

const filterConteiner = document.querySelector('.trip-controls__filters');
const filters = generateFilter(pointsModel.points);
render(new FilterView(filters), filterConteiner);

boardPresenter.init();
