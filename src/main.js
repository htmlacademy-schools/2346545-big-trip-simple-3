import { render } from './render';
import BoardPresenter from './presenter/board-presenter';
import FilterView from './view/view-filter';
import PointsModel from './model/point-model';
import { getRandPoint } from './mock/point';
import { generateFilter } from './mock/filter.js';

const pageContainer = document.querySelector('.trip-events');
const POINT_COUNT = 3;
const points = Array.from({length: POINT_COUNT}, getRandPoint);
const pointsModel = new PointsModel(points);
const boardPresenter = new BoardPresenter({ boardContainer: pageContainer, pointsModel });

const filterConteiner = document.querySelector('.trip-controls__filters');
const filters = generateFilter(pointsModel.points);
render(new FilterView(filters), filterConteiner);

boardPresenter.init();
