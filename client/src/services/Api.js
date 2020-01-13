import axios from 'axios'
import JwtTokenInterceptor from '@/services/JwtTokenInterceptor'


export default class Api {
  constructor (store) {
    if (store) {
      this.store = store
    }
    this.pathPrefix = process.env.VUE_APP_BASEURL
    this.refreshTokenPath = this.pathPrefix + 'api/user/refreshToken'
  }
 
  saveToken(response) {
    //console.log('###### saveToken:' + JSON.stringify(response))
    let tokens = { accessToken: undefined, refreshToken: undefined }
    if (response) {
      const userCtxt = response.data.user
      tokens = { accessToken: userCtxt.accessToken, refreshToken: userCtxt.refreshToken }
      delete userCtxt.accessToken
      delete userCtxt.refreshToken
      this.store.dispatch('ctxtStore/set', response.data.user)
    }
    this.store.dispatch('ctxtStore/setTokens', tokens)
  }

  getAccessToken () {
    const tokens = this.store.getters['ctxtStore/getTokens']
    let result = null
    if ((tokens) && (tokens.accessToken)){
      result = tokens.accessToken     
    } 
    if ((! result) || (result === null)) { 
      throw new Error('unauthorized') 
    }
    return result
  }
  
  getRefreshToken () {
    const tokens = this.store.getters['ctxtStore/getTokens']
    let result = null
    if ((tokens) && (tokens.refreshToken)){
      result = tokens.refreshToken
    } 
    if ((! result) || (result === null)) throw new Error('unauthorized') 
    return result
  }


  isTokenExpiredError (errorResponse) {
    let result = false
    if (errorResponse.status === 401) result = true
    return result
  }
  
  async getAuthorized (service, params, pathPrefix) {
    // const token = this.keycloak.token
    const config = {
      headers: {
        'Authorization': ('Bearer ' + this.getAccessToken()),
        'Access-Control-Allow-Origin': '*'
      }
    }
    if (params !== undefined) config.params = params
    const servicePath = (pathPrefix === undefined) ? (this.pathPrefix + service) : (pathPrefix + service)
    const custAxios = axios.create(config)
    // const interceptor = 
    const interceptor = new JwtTokenInterceptor(custAxios, this, [401], this.refreshTokenPath)
    interceptor.init(interceptor)
    const response = await custAxios.get(servicePath)
    let result = response
    return result
  }

  async get (service, params, pathPrefix) {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
    if (params !== undefined) config.params = params
    const servicePath = (pathPrefix === undefined) ? (this.pathPrefix + service) : (pathPrefix + service)
    const custAxios = axios.create(config)
    const response = await custAxios.get(servicePath)
    let result = response
    return result
  }

  async putAuthorized (service, params, data) {
    const config = {
      headers: {
        'Authorization': ('Bearer ' + this.getAccessToken()),
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }
    if (params !== undefined) config.params = params
    const custAxios = axios.create(config)
    // const interceptor = 
    const interceptor = new JwtTokenInterceptor(custAxios, this, [401], this.refreshTokenPath)
    interceptor.init(interceptor)
    const servicePath = this.pathPrefix + service
    let response = undefined
    response = await custAxios.put(servicePath, data)
    return response
  }

  async put (service, params, data) {
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }
    if (params !== undefined) config.params = params
    const custAxios = axios.create(config)
    const servicePath = this.pathPrefix + service    
    let response = await custAxios.put(servicePath, data)
    return response
  }

  async postAuthorized (service, params, data) {
    // const token = this.keycloak.token
    const config = {
      headers: {
        'Authorization': ('Bearer ' + this.getAccessToken()),
        'Accept': "application/json",
        'Content-type': "application/json"
      }
    }
    if (params !== undefined) config.params = params
    const custAxios = axios.create(config)
    // const interceptor = 
    const interceptor = new JwtTokenInterceptor(custAxios, this, [401], this.refreshTokenPath)
    interceptor.init(interceptor)
    const servicePath = this.pathPrefix + service
    let response = undefined
    response = await custAxios.post(servicePath, data)
    return response
  }

  async post (service, params, data) {
    const config = {
      headers: {
        'Accept': "application/json",
        'Content-type': "application/json"
      }
    }
    if (params !== undefined) config.params = params
    const custAxios = axios.create(config)

    const servicePath = this.pathPrefix + service
    let response = undefined
    response = await custAxios.post(servicePath, data)
    return response
  }
}
