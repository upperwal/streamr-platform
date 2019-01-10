// @flow

export const USER_DATA_REQUEST: string = 'marketplace/user/USER_DATA_REQUEST'
export const USER_DATA_SUCCESS: string = 'marketplace/user/USER_DATA_SUCCESS'
export const USER_DATA_FAILURE: string = 'marketplace/user/USER_DATA_FAILURE'

export const LOGOUT_REQUEST: string = 'marketplace/user/LOGOUT_REQUEST'
export const LOGOUT_SUCCESS: string = 'marketplace/user/LOGOUT_SUCCESS'
export const LOGOUT_FAILURE: string = 'marketplace/user/LOGOUT_FAILURE'

// TODO: Let's get rid of the following 2 consts after the migration to the new
//       auth stuff is complete. — Mariusz
export const EXTERNAL_LOGIN_START: string = 'marketplace/user/EXTERNAL_LOGIN_START'
export const EXTERNAL_LOGIN_END: string = 'marketplace/user/EXTERNAL_LOGIN_END'

export const SAVE_CURRENT_USER_REQUEST = 'marketplace/user/SAVE_CURRENT_USER_REQUEST'
export const SAVE_CURRENT_USER_SUCCESS = 'marketplace/user/SAVE_CURRENT_USER_SUCCESS'
export const SAVE_CURRENT_USER_FAILURE = 'marketplace/user/SAVE_CURRENT_USER_FAILURE'

export const UPDATE_CURRENT_USER = 'marketplace/user/UPDATE_CURRENT_USER'

export const UPDATE_PASSWORD_REQUEST = 'marketplace/user/UPDATE_PASSWORD_REQUEST'
export const UPDATE_PASSWORD_SUCCESS = 'marketplace/user/UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_FAILURE = 'marketplace/user/UPDATE_PASSWORD_FAILURE'

export const DELETE_USER_ACCOUNT_REQUEST = 'marketplace/user/DELETE_USER_ACCOUNT_REQUEST'
export const DELETE_USER_ACCOUNT_SUCCESS = 'marketplace/user/DELETE_USER_ACCOUNT_SUCCESS'
export const DELETE_USER_ACCOUNT_FAILURE = 'marketplace/user/DELETE_USER_ACCOUNT_FAILURE'
