//Module 6
//Task 2

import { render } from './framework/render';
import BoardPresenter from './presenter/board-presenter';
import FilterView from './view/view-filter';
import PointsModel from './model/point-model';
import { generateFilter } from './mock/filter.js';
import { getRandPoint } from './mock/point.js';


const POINT_COUNT = 3;
const pageContainer = document.querySelector('.trip-events');
const points = Array.from({length: POINT_COUNT}, getRandPoint);
const pointsModel = new PointsModel(points);
const boardPresenter = new BoardPresenter({ boardContainer: pageContainer, pointsModel });

const filterConteiner = document.querySelector('.trip-controls__filters');
const filters = generateFilter(pointsModel.points);
render(new FilterView(filters), filterConteiner);

boardPresenter.init();
