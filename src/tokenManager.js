import Cookies from 'js-cookie'

let accessToken = null

const tokenManager = {
  setToken: function (token) {
    accessToken = token
  },

  getToken: function () {
    return accessToken
  },

  loadTokenFromCookie: function () {
    const token = Cookies.get('accessToken')
    if (token) {
      accessToken = token 
    }
  }
}

export default tokenManager
