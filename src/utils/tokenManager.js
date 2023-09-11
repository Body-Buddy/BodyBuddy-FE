import Cookies from 'js-cookie'

let accessToken = null
let refreshToken = null

const tokenManager = {
  setAccessToken: function (token) {
    accessToken = token
  },

  getAccessToken: function () {
    return accessToken
  },

  loadAccessToken: function () {
    const token = Cookies.get('accessToken')
    if (token) {
      accessToken = token 
    }
  },

  getRefreshToken: function () {
    return refreshToken
  },

  loadRefreshToken: function () {
    const token = Cookies.get('refreshToken')
    if(token) {
      refreshToken = token
    }
  }
}

export default tokenManager
