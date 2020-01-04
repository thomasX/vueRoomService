import axios from 'axios';
import { Promise } from "es6-promise";
import { router } from '../app';

export default (userCtxt) => {

  axios.interceptors.response.use( (response) => {
    // Return a successful response back to the calling service
    return response;
  }, (error) => {
    // Return any error which is not due to authentication back to the calling service
    if (error.response.status !== 401) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // Logout user if token refresh didn't work or user is disabled
    if (error.config.url == '/api/token/refresh' || error.response.message == 'Account is disabled.') {
      
      TokenStorage.clear();
      router.push({ name: 'root' });

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // Try request again with new token
    return TokenStorage.getNewToken()
      .then((token) => {

        // New request with new token
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${token}`;

        return new Promise((resolve, reject) => {
          axios.request(config).then(response => {
            resolve(response);
          }).catch((error) => {
            reject(error);
          })
        });

      })
      .catch((error) => {
      	Promise.reject(error);
      });
  });
}