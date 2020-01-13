import axios from 'axios'



export default class JwtTokenInterceptor {
  
  constructor (customAxios, tokenUtils, errorCodes, refreshTokenPath ){
    
    // This is the list of waiting requests that will retry after the JWT refresh complete
    
    this.customAxios = customAxios
    this.tokenUtils = tokenUtils
    this.errorCodes = (!errorCodes) ? [401] : errorCodes
    this.refreshTokenPath = refreshTokenPath
    this.subscribers = []
    this.isAlreadyFetchingAccessToken = false
  }



  init(curInterceptor) {
    this.customAxios.interceptors.response.use(
    function(response) {
      // If the request succeeds, we don't have to do anything and just return the response
      return response
    },
    function(error) {
      const errorResponse = error.response
      if (curInterceptor.isTokenExpiredError(errorResponse)) {
        console.log('######### token expired -> refresh required')
        return curInterceptor.resetTokenAndReattemptRequest(error)
      }
      // If the error is due to other reasons, we just throw it back to axios
      return Promise.reject(error)
    })
  }

  isTokenExpiredError (errorResponse) {
    // Your own logic to determine if the error is due to JWT token expired returns a boolean value
    const currentErrorCode = errorResponse.status
    const result = [401, 403].includes(currentErrorCode)
    return result
  }

  async resetTokenAndReattemptRequest(error) {
    try {
      const { response: errorResponse } = error
      const resetToken = await this.tokenUtils.getRefreshToken()
      // Your own mechanism to get the refresh token to refresh the JWT token
      if (!resetToken) {
        // We can't refresh, throw the error anyway
        return Promise.reject(error);
      }
      /* Proceed to the token refresh procedure
      We create a new Promise that will retry the request,
      clone all the request configuration from the failed
      request in the error object. */
      const retryOriginalRequest = new Promise(resolve => {
      /* We need to add the request retry to the queue
      since there another request that already attempt to
      refresh the token */
        this.addSubscriber(access_token => {
          errorResponse.config.headers.Authorization = 'Bearer ' + access_token
          resolve(axios(errorResponse.config))
        });
      });
      if (!this.isAlreadyFetchingAccessToken) {
        this.isAlreadyFetchingAccessToken = true
        const refreshPath = this.refreshTokenPath
        const refreshToken = await this.tokenUtils.getRefreshToken()
        const response = await axios({
          method: 'post',
          url: refreshPath,
          data: {
            refreshToken: refreshToken 
          }
        })
        if (!response.data) {
          return Promise.reject(error)
        }
        this.tokenUtils.saveToken(response)
        this.isAlreadyFetchingAccessToken = false
        const newToken = await this.tokenUtils.getAccessToken()
        this.onAccessTokenFetched(newToken)
      }
      return retryOriginalRequest
    } catch (err) {
      if (err.response.status === 401) this.tokenUtils.saveToken()
      return Promise.reject(err)
    }
  }

  onAccessTokenFetched(access_token) {
    // When the refresh is successful, we start retrying the requests one by one and empty the queue
    this.subscribers.forEach(callback => callback(access_token))
    this.subscribers = []
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }
}
