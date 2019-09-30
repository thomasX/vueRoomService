import axios from 'axios'

export default class Api {
  constructor () {
    this.pathPrefix = process.env.VUE_APP_BASEURL
  }
  
  // async getAuthorized (service, params, pathPrefix) {
  //   const token = this.keycloak.token
  //   const config = {
  //     headers: {
  //       'Authorization': ('Bearer ' + token),
  //       'Access-Control-Allow-Origin': '*'
  //     }
  //   }
  //   if (params !== undefined) config.params = params
  //   const servicePath = (pathPrefix === undefined) ? (this.pathPrefix + service) : (pathPrefix + service)
  //   const response = await axios.get(servicePath, config).catch(error => {
  //     console.log('Error: /n' + JSON.stringify(error))
  //   })
  //   let result = response
  //   return result
  // }

  async get (service, params, pathPrefix) {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
    if (params !== undefined) config.params = params
    const servicePath = (pathPrefix === undefined) ? (this.pathPrefix + service) : (pathPrefix + service)
    console.log('servicePath:' + servicePath)
    const response = await axios.get(servicePath, config).catch(error => {
      console.log('Error: /n' + JSON.stringify(error))
    })
    let result = response
    return result
  }

  // async putAuthorized (service, params, data) {
  //   const token = this.keycloak.token
  //   const config = {
  //     headers: {
  //       'Authorization': ('Bearer ' + token),
  //       'Access-Control-Allow-Origin': '*'
  //     }
  //   }
  //   if (params !== undefined) config.params = params
  //   const servicePath = this.pathPrefix + service
  //   let response = await axios.put(servicePath, data, config).catch(error => {
  //     console.log('Error: /n' + JSON.stringify(error))
  //   })
  //   return response
  // }

  async put (service, params, data) {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
    if (params !== undefined) config.params = params
    const servicePath = this.pathPrefix + service
    let response = await axios.put(servicePath, data, config).catch(error => {
      console.log('Error: /n' + JSON.stringify(error))
    })
    return response
  }

    // async postAuthorized (service, params, data) {
  //   const token = this.keycloak.token
  //   const config = {
  //     headers: {
  //       'Authorization': ('Bearer ' + token),
  //       'Access-Control-Allow-Origin': '*'
  //     }
  //   }
  //   if (params !== undefined) config.params = params
  //   const servicePath = this.pathPrefix + service
  //   let response = await axios.put(servicePath, data, config).catch(error => {
  //     console.log('Error: /n' + JSON.stringify(error))
  //   })
  //   return response
  // }

  async post (service, params, data) {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
    if (params !== undefined) config.params = params
    const servicePath = this.pathPrefix + service
    let response = await axios.put(servicePath, data, config).catch(error => {
      console.log('Error: /n' + JSON.stringify(error))
    })
    return response
  }
}
