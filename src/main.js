//Module 7
//Task 1

import BoardPresenter from './presenter/board-presenter';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButton from './view/view-new-point-button.js';
import PointApiService from './point-api-service.js';
import PointModel from './model/point-model';
import { render } from './framework/render';

const AUTHORIZATION = 'Unidentified raccoon';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const pageHeader = document.querySelector('.trip-main');
const pageFilterElement = document.querySelector('.trip-controls__filters');
const pageContainer = document.querySelector('.trip-events');
const filterModel = new FilterModel();
const pointsApiService = new PointApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointModel({ pointsApiService: pointsApiService });

const boardPresenter = new BoardPresenter({
  boardContainer: pageContainer,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: pageFilterElement,
  filterModel: filterModel,
  pointsModel: pointsModel
});

const newPointButtonComponent = new NewPointButton({ onClick: handleNewPointButtonClick });

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

render(newPointButtonComponent, pageHeader);

pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, pageHeader);
  });
filterPresenter.init();
boardPresenter.init();
