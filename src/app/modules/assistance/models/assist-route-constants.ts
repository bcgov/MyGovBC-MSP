import { APP_ROUTES } from '../../msp-core/models/route-constants';

export const ROUTES_ASSIST = {
  HOME: {
    index: 1,
    path: 'home',
    fullpath: `${APP_ROUTES.ASSISTANCE}/home`,
    title: 'home',
    btnLabel: 'Apply for Retroactive Premium Assistance',
    btnDefaultColor: false
  },
  PERSONAL_INFO: {
    index: 2,
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/personal-info`,
    title: 'Personal Information',
    btnLabel: 'Continue',
    btnDefaultColor: true
  },
  SPOUSE_INFO: {
    index: 3,
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/spouse-info`,
    title: 'Spouse Information',
    btnLabel: 'No Spouse',
    btnDefaultColor: true
  },
  CONTACT: {
    index: 4,
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/contact-info`,
    title: 'Contact Information',
    btnLabel: 'Continue',
    btnDefaultColor: true
  },
  REVIEW: {
    index: 5,
    path: 'review',
    fullpath: `${APP_ROUTES.ASSISTANCE}/review`,
    title: 'Review',
    btnLabel: 'Continue',
    btnDefaultColor: true
  },
  AUTHORIZE: {
    index: 6,
    path: 'authorize',
    fullpath: `${APP_ROUTES.ASSISTANCE}/authorize`,
    title: 'Authorize',
    btnLabel: 'Submit',
    btnDefaultColor: false
  },
  CONFIRMATION: {
    index: 7,
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ASSISTANCE}/confirmation`,
    title: 'Confirmation',
  },
};
