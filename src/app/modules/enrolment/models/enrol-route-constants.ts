import { APP_ROUTES } from '../../../models/route-constants';

export const ROUTES_ENROL = {
  CHECK_ELIG: {
    index: 1,
    path: 'check-eligibility',
    fullpath: `${APP_ROUTES.ENROLMENT}/check-eligibility`,
    title: 'Eligibility - MSP Enrolment',
  },
  PERSONAL_INFO: {
    index: 2,
    path: 'personal-info',
    fullpath: `${APP_ROUTES.ENROLMENT}/personal-info`,
    title: 'Personal Info - MSP Enrolment',
  },
  SPOUSE_INFO: {
    index: 3,
    path: 'spouse-info',
    fullpath: `${APP_ROUTES.ENROLMENT}/spouse-info`,
    title: 'Spouse Info - MSP Enrolment',
  },
  CHILD_INFO: {
    index: 4,
    path: 'child-info',
    fullpath: `${APP_ROUTES.ENROLMENT}/child-info`,
    title: 'Child Info - MSP Enrolment',
  },
  CONTACT: {
    index: 5,
    path: 'contact-info',
    fullpath: `${APP_ROUTES.ENROLMENT}/contact-info`,
    title: 'Contact Info - MSP Enrolment',
  },
  REVIEW: {
    index: 6,
    path: 'review',
    fullpath: `${APP_ROUTES.ENROLMENT}/review`,
    title: 'Review - MSP Enrolment',
  },
  AUTHORIZE: {
    index: 7,
    path: 'authorize',
    fullpath: `${APP_ROUTES.ENROLMENT}/authorize`,
    title: 'Authorize - MSP Enrolment',
  },
  CONFIRMATION: {
    index: 8,
    path: 'confirmation',
    fullpath:
     `${APP_ROUTES.ENROLMENT}/confirmation`,
    title: 'Confirmation - MSP Enrolment',
  },
};
