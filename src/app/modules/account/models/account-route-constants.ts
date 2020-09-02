import { APP_ROUTES } from '../../../models/route-constants';

export const ROUTES_ACCOUNT = {
  PERSONAL_INFO: {
    index: 1,
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/personal-info`,
    title: 'Personal Information',
  },
  SPOUSE_INFO: {
    index: 2,
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/spouse-info`,
    title: 'Spouse Information',
  },
  CHILD_INFO: {
    index: 3,
    path: 'child-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/child-info`,
    title: 'Child Information',
  },
  CONTACT: {
    index: 4,
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/contact-info`,
    title: 'Contact Information',
  },
  REVIEW: {
    index: 5,
    path: 'review',
    fullpath: `${APP_ROUTES.ACCOUNT}/review`,
    title: 'Review',
  },
  AUTHORIZE: {
    index: 6,
    path: 'authorize',
    fullpath: `${APP_ROUTES.ACCOUNT}/authorize`,
    title: 'Authorize',
  },
  SENDING: {
    index: 7,
    path: 'sending',
    fullpath: `${APP_ROUTES.ACCOUNT}/sending`,
    title: 'Sending',
  },
  CONFIRMATION: {
    index: 8,
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ACCOUNT}/confirmation`,
    title: 'Confirmation',
  },
};
