import {accessToken} from './auth';
export const faccessToken = (state) => accessToken(state.auth);

export function withAuth(headers = {}) {
  return (state) => ({
    ...headers,
    Authorization: `Bearer ${faccessToken(state)}`,
  });
}
