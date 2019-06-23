  const namespaced = true
  const state = {
    mandCtxt: {},
    version: {}
  }
  
  const getters = {
    mandCtxt: (state) => state.mandCtxt,
    version: (state) => state.version
  }
  
  const actions = {
    async getMandCtxt ({ commit }) {
      // const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?_limit=${maxLines}`)
      const response = {
        data: {
          curToolID: '98798',
          email: 'vueUser@felder-group.com',
          defaultWebPrinter: '',
          curUserName: 'maz47@gmail.com'
        }
      }
      commit('setMandantenUserCtxt', response.data)
    },
    async getVersion ({ commit }) {
      // const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?_limit=${maxLines}`)
      const response = {
        data: {
          curVersion: 'v17.06c02 (2019/06/04)'
        }
      }
      commit('setVersion', response.data)
    }
  }
  
  const mutations = {
    setMandantenUserCtxt: (state, mandCtxt) => (state.mandCtxt = mandCtxt),
    setVersion: (state, version) => (state.version = version)
  }
  
  export default {
    namespaced,
    state,
    getters,
    actions,
    mutations
  }
  