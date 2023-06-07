const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const remove = (component) => {
  if (component === null) { return; }
  component.element.remove();
  component.removeElement();
};

const render = (component, container, place = RenderPosition.BEFOREEND) => {
  container.insertAdjacentElement(place, component.element);
};

const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.element;
  const oldElement = oldComponent.element;
  const parent = oldElement.parentElement;
  if (parent === null) { throw new Error('Parent element doesn\'t exist'); }
  parent.replaceChild(newElement, oldElement);
};


export { createElement, render, RenderPosition, remove, replace };
