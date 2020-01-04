import axios from 'axios'
import store from '@/stores/store'


export default class Api {
  constructor (store) {
    if (store) {
      this.store = store
    }
    this.pathPrefix = process.env.VUE_APP_BASEURL
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
    const response = await axios.get(servicePath, config)
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
    const response = await axios.get(servicePath, config)
    let result = response
    return result
  }

  async putAuthorized (service, params, data) {
    // const token = this.keycloak.token
    const accessToken = this.getAccessToken()
    const config = {
      headers: {
        'Authorization': ('Bearer ' + this.getAccessToken()),
        'Accept': 'application/json',
        'Content-type': 'application/json'
      }
    }
    if (params !== undefined) config.params = params
    const servicePath = this.pathPrefix + service
    let response = await axios.put(servicePath, data, config)
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
    const servicePath = this.pathPrefix + service    
    let response = await axios.put(servicePath, data, config)
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
    const servicePath = this.pathPrefix + service
    let response = undefined
    response = await axios.post(servicePath, data, config)
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
    const servicePath = this.pathPrefix + service
    let response = undefined
    response = await axios.post(servicePath, data, config)
    return response
  }
}
