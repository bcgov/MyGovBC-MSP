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

export const ACCOUNT_PAGES = {
  HOME: {
    path: PAGE_NAMES.home,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.home}`,
    title: PAGE_NAMES.home,
  },
  PERSONAL_INFO: {
    path: PAGE_NAMES.personalInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.personalInfo}`,
    title: PAGE_NAMES.personalInfo,
  },
  SPOUSE_INFO: {
    path: PAGE_NAMES.spouseInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.spouseInfo}`,
    title: PAGE_NAMES.spouseInfo,
  },
  CHILD_INFO: {
    path: PAGE_NAMES.childInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.childInfo}`,
    title: PAGE_NAMES.childInfo,
  },
  CONTACT_INFO: {
    path: PAGE_NAMES.contactInfo,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.contactInfo}`,
    title: PAGE_NAMES.contactInfo,
  },
  REVIEW: {
    path: PAGE_NAMES.review,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.review}`,
    title: PAGE_NAMES.review,
  },
  AUTHORIZE: {
    path: PAGE_NAMES.authorize,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.authorize}`,
    title: PAGE_NAMES.authorize,
  },
  SENDING: {
    path: PAGE_NAMES.sending,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.sending}`,
    title: PAGE_NAMES.sending,
  },
  CONFIRMATION: {
    path: PAGE_NAMES.confirmation,
    fullpath: `${APP_ROUTES.ACCOUNT}/${PAGE_NAMES.confirmation}`,
    title: PAGE_NAMES.confirmation,
  },
};
