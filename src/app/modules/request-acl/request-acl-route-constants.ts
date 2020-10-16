import { APP_ROUTES } from '../../models/route-constants';

export const ROUTES_ACL = {
  REQUEST_ACL: {
    index: 1,
    path: 'request-acl',
    fullpath: `${APP_ROUTES.ACCOUNT_LETTER}/request-acl`,
    title: 'Request - MSP Account Confirmation Letter Request',
  },
  CONFIRMATION: {
    index: 1,
    path: 'confirmation',
    fullpath: `${APP_ROUTES.ACCOUNT_LETTER}/confirmation`,
    title: 'Confirmation - MSP Account Confirmation Letter Request',
  },
};
