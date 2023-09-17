module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_SERVER_URL,
        changeOrigin: true,
        ws: true
      }
    }
  }
}
