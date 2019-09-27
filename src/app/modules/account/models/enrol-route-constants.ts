import { APP_ROUTES } from "app/models/route-constants";


export const ROUTES_ACCOUNT = {
  CHECK_ELIG: {
    index: 1,
    path: 'check-eligibility',
    fullpath: `${APP_ROUTES.ACCOUNT}/check-eligibility`,
    title: 'Check Eligibility',
  },
  PERSONAL_INFO: {
    index: 2,
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/personal-info`,
    title: 'Personal Information',
  },
  SPOUSE_INFO: {
    index: 3,
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/spouse-info`,
    title: 'Spouse Information',
  },
  CHILD_INFO: {
    index: 4,
    path: 'child-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/child-info`,
    title: 'Child Information',
  },
  CONTACT: {
    index: 5,
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ACCOUNT}/contact-info`,
    title: 'Contact Information',
  },
  REVIEW: {
    index: 6,
    path: 'review',
    fullpath: `${APP_ROUTES.ACCOUNT}/review`,
    title: 'Review',
  },
  AUTHORIZE: {
    index: 7,
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
