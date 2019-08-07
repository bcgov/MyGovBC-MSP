import { APP_ROUTES } from '../../msp-core/models/route-constants';

export const ROUTES_ASSIST = {
  HOME: {
      path: 'home',
      fullpath: `${APP_ROUTES.ASSISTANCE}/home`,
      title: 'home',
  },
  PERSONAL_INFO: {
      path: 'personal-info',
      fullpath: `${APP_ROUTES.ASSISTANCE}/personal-info`,
      title: 'Personal Information',
  },
  SPOUSE_INFO: {
      path: 'spouse-info',
      fullpath: `${APP_ROUTES.ASSISTANCE}/spouse-info`,
      title: 'Spouse Information',
  },
  CONTACT: {
      path: 'contact-info',
      fullpath: `${APP_ROUTES.ASSISTANCE}/contact-info`,
      title: 'Contact Information',
  },
  REVIEW: {
      path: 'review',
      fullpath: `${APP_ROUTES.ASSISTANCE}/review`,
      title: 'Review',
  },
  AUTHORIZE: {
    path: 'authorize',
    fullpath: `${APP_ROUTES.ASSISTANCE}/authorize`,
    title: 'Authorize',
  },
  CONFIRMATION: {
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ASSISTANCE}/confirmation`,
    title: 'Confirmation',
  },
};
