import { APP_ROUTES } from '../../msp-core/models/route-constants';


export const ROUTES_ENROL = {
  CHECK_ELIG: {
      path: 'check-eligibility',
      fullpath: `${APP_ROUTES.ENROLMENT}/check-eligibility`,
      title: 'Check Eligibility',
  },
  PERSONAL_INFO: {
      path: 'personal-info',
      fullpath: `${APP_ROUTES.ENROLMENT}/personal-info`,
      title: 'Personal Information',
  },
  SPOUSE_INFO: {
      path: 'spouse-info',
      fullpath: `${APP_ROUTES.ENROLMENT}/spouse-info`,
      title: 'Spouse Information',
  },
  CHILD_INFO: {
      path: 'child-info',
      fullpath: `${APP_ROUTES.ENROLMENT}/child-info`,
      title: 'Child Information',
  },
  CONTACT: {
      path: 'contact-info',
      fullpath: `${APP_ROUTES.ENROLMENT}/contact-info`,
      title: 'Contact Information',
  },
  REVIEW: {
      path: 'review',
      fullpath: `${APP_ROUTES.ENROLMENT}/review`,
      title: 'Review',
  },
  AUTHORIZE: {
    path: 'authorize',
    fullpath: `${APP_ROUTES.ENROLMENT}/authorize`,
    title: 'Authorize',
  },
  CONFIRMATION: {
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ENROLMENT}/confirmation`,
    title: 'Confirmation',
  },
};
