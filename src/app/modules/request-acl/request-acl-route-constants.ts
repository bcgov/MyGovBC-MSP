import { APP_ROUTES } from '../../models/route-constants';

export const ROUTES_ACL = {
  REQUEST_ACL: {
    index: 1,
    path: 'request-acl',
    fullpath: `${APP_ROUTES.ACCOUNT_LETTER}/request-acl`,
    title: 'Request Account Confirmation Letter',
  },
  SENDING: {
    index: 2,
    path: 'sending',
    fullpath: `${APP_ROUTES.ACCOUNT_LETTER}/sending`,
    title: 'Sending',
  },
  CONFIRMATION: {
    index: 2,
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ACCOUNT_LETTER}/confirmation`,
    title: 'Confirmation',
  },
};
