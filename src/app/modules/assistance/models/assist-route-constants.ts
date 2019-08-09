import { APP_ROUTES } from '../../msp-core/models/route-constants';

export const ROUTES_ASSIST = {
  HOME: {
    index: 1,
    path: 'home',
    fullpath: `${APP_ROUTES.ASSISTANCE}/home`,
    title: 'home',
  },
  PERSONAL_INFO: {
    index: 2,
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/personal-info`,
    title: 'Personal Information',
  },
  SPOUSE_INFO: {
    index: 3,
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/spouse-info`,
    title: 'Spouse Information',
  },
  CONTACT: {
    index: 4,
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/contact-info`,
    title: 'Contact Information',
  },
  REVIEW: {
    index: 6,
    path: 'review',
    fullpath: `${APP_ROUTES.ASSISTANCE}/review`,
    title: 'Review',
  },
  AUTHORIZE: {
    index: 7,
    path: 'authorize',
    fullpath: `${APP_ROUTES.ASSISTANCE}/authorize`,
    title: 'Authorize',
  },
  CONFIRMATION: {
    index: 8,
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ASSISTANCE}/confirmation`,
    title: 'Confirmation',
  },
};
