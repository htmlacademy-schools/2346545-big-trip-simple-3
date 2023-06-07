import { createPicture } from './picture';
import { descriptions, places } from './data';
import { getRandElement, getRandID } from '../util';

const destinationsId = [];
const destinationsList = [];

const getRandDestination = () => {
  let id = getRandID();
  while (destinationsId.includes(id)) {
    id = getRandID();
  }
  destinationsId.push(id);
  const description = getRandElement(descriptions);
  const name = getRandElement(places);
  const pictures = createPicture();
  const destination = { id, description, name, pictures };
  destinationsList.push(destination);
  return id;
};

const getCityDescriptionById = (id) => destinationsList.find((destination) => destination.id === id).description;
const getCityNameById = (id) => destinationsList.find((destination) => destination.id === id).name;
const getCityPictureById = (id) => destinationsList.find((destination) => destination.id === id).pictures.src;
const getIdByCityName = (name) => destinationsList.find((destination) => destination.name === name).id;

export { getCityDescriptionById, getCityNameById, getCityPictureById, getIdByCityName, getRandDestination };
