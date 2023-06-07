import { getRandPicture, getRandElement } from '../util';
import { descriptions } from './data';

export const createPicture = () => ({
  src: getRandPicture(),
  description: getRandElement(descriptions)
});
