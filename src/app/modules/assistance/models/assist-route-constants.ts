import { APP_ROUTES } from '../../../models/route-constants';

export const ROUTES_ASSIST = {
  HOME: {
    index: 1,
    path: 'home',
    fullpath: `${APP_ROUTES.ASSISTANCE}/home`,
    title: 'Home - MSP Retroactive Premium Assistance',
    btnLabel: 'Apply - MSP Retroactive Premium Assistance',
    btnDefaultColor: true
  },
  PERSONAL_INFO: {
    index: 2,
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/personal-info`,
    title: 'Personal Info - MSP Retroactive Premium Assistance',
    btnLabel: 'Continue',
    btnDefaultColor: false
  },
  SPOUSE_INFO: {
    index: 3,
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/spouse-info`,
    title: 'Spouse Info - MSP Retroactive Premium Assistance',
    btnLabel: 'No Spouse',
    btnDefaultColor: false
  },
  CONTACT: {
    index: 4,
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ASSISTANCE}/contact-info`,
    title: 'Contact Info - MSP Retroactive Premium Assistance',
    btnLabel: 'Continue',
    btnDefaultColor: false
  },
  REVIEW: {
    index: 5,
    path: 'review',
    fullpath: `${APP_ROUTES.ASSISTANCE}/review`,
    title: 'Review - MSP Retroactive Premium Assistance',
    btnLabel: 'Continue',
    btnDefaultColor: false
  },
  AUTHORIZE: {
    index: 6,
    path: 'authorize',
    fullpath: `${APP_ROUTES.ASSISTANCE}/authorize`,
    title: 'Authorize - MSP Retroactive Premium Assistance',
    btnLabel: 'Submit',
    btnDefaultColor: true
  },
  CONFIRMATION: {
    index: 7,
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ASSISTANCE}/confirmation`,
    title: 'Confirmation - MSP Retroactive Premium Assistance',
  },
};
