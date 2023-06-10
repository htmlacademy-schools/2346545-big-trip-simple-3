//Module 7
//Task 1 fix

import BoardPresenter from './presenter/board-presenter';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButton from './view/view-new-point-button';
import PointApiService from './point-api-service';
import PointModel from './model/point-model';
import { render } from './framework/render';

const AUTHORIZATION = 'Basic unidentifiedRaccoon';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const pageContainer = document.querySelector('.trip-events');
const pageHeader = document.querySelector('.trip-main');
const pageFilterElement = document.querySelector('.trip-controls__filters');
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

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}
render(newPointButtonComponent, pageHeader);

pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, pageHeader);
  });
filterPresenter.init();
boardPresenter.init();
