import { APP_ROUTES } from "../../models/route-constants";

const PAGE_NAMES = {
  home: 'home',
  personalInfo: 'personal-info',
  spouseInfo: 'spouse-info',
  childInfo: 'child-info',
  contactInfo: 'contact-info',
  review: 'review',
  authorize: 'authorize',
  sending: 'sending',
  confirmation: 'confirmation',
};

const PAGE_TITLES = {
  home: 'Home',
  personalInfo: 'Personal Information',
  spouseInfo: 'Spouse Information',
  childInfo: 'Child Information',
  contactInfo: 'Contact Information',
  review: 'Review',
  authorize: 'Authorize',
  sending: 'Sending',
  confirmation: 'Confirmation',
};

export const ACCOUNT_PAGES = {
  HOME: {
    path: PAGE_NAMES.home,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.home}`,
    title: PAGE_TITLES.home,
  },
  PERSONAL_INFO: {
    index: 1,
    path: PAGE_NAMES.personalInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.personalInfo}`,
    title: PAGE_TITLES.personalInfo,
  },
  SPOUSE_INFO: {
    index: 2,
    path: PAGE_NAMES.spouseInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.spouseInfo}`,
    title: PAGE_TITLES.spouseInfo,
  },
  CHILD_INFO: {
    index: 3,
    path: PAGE_NAMES.childInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.childInfo}`,
    title: PAGE_TITLES.childInfo,
  },
  CONTACT_INFO: {
    index: 4,
    path: PAGE_NAMES.contactInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.contactInfo}`,
    title: PAGE_TITLES.contactInfo,
  },
  REVIEW: {
    index: 5,
    path: PAGE_NAMES.review,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.review}`,
    title: PAGE_TITLES.review,
  },
  AUTHORIZE: {
    index: 6,
    path: PAGE_NAMES.authorize,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.authorize}`,
    title: PAGE_TITLES.authorize,
  },
  SENDING: {
    index: 7,
    path: PAGE_NAMES.sending,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.sending}`,
    title: PAGE_TITLES.sending,
  },
  CONFIRMATION: {
    index: 8,
    path: PAGE_NAMES.confirmation,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.confirmation}`,
    title: PAGE_TITLES.confirmation,
  },
};
