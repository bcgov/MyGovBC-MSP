import { APP_ROUTES } from "../../models/route-constants";

export const ACCOUNT_PAGES = {
  HOME: {
    path: 'home',
    fullpath: `${APP_ROUTES.ACCOUNT}/home`,
    title: 'Home - MSP Account Change Request',
  },
  PERSONAL_INFO: {
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/personal-info`,
    title: 'Personal Info - MSP Account Change Request',
  },
  SPOUSE_INFO: {
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/spouse-info`,
    title: 'Spouse Info - MSP Account Change Request',
  },
  CHILD_INFO: {
    path: 'child-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/child-info`,
    title: 'Child Info - MSP Account Change Request',
  },
  CONTACT_INFO: {
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/'contact-info'`,
    title: 'Contact Info - MSP Account Change Request',
  },
  REVIEW: {
    path: 'review',
    fullpath: `${APP_ROUTES.ACCOUNT}/'review'`,
    title: 'Review - MSP Account Change Request',
  },
  AUTHORIZE: {
    path: 'authorize',
    fullpath: `${APP_ROUTES.ACCOUNT}/'authorize'`,
    title: 'Authorize - MSP Account Change Request',
  },
  SENDING: {
    path: 'sending',
    fullpath: `${APP_ROUTES.ACCOUNT}/'sending'`,
    title: 'Sending - MSP Account Change Request',
  },
  CONFIRMATION: {
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ACCOUNT}/'confirmation'`,
    title: 'Confirmation - MSP Account Change Request',
  },
};
