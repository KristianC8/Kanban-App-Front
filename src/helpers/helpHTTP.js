export const helpHTTP = () => {
  const customFetch = async (endPoint, options) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    options.method = options.method || 'GET'
    options.headers = options.headers
      ? { ...defaultHeaders, ...options.headers }
      : defaultHeaders
    options.body = JSON.stringify(options.body) || false
    if (!options.body) delete options.body

    try {
      let response = await fetch(endPoint, options)
      if (!response.ok)
        throw { status: response.status, statusText: response.statusText }
      let data = await response.json()
      return data
    } catch (error) {
      let message = error.statusText || 'No fue posible acceder a la API',
        code = error.status || '00'
      return `Error  ${code} : ${message}`
    }
  }

  const get = (url, options = {}) => customFetch(url, options)

  const post = (url, options = {}) => {
    options.method = 'POST'
    return customFetch(url, options)
  }

  const put = (url, options = {}) => {
    options.method = 'PUT'
    return customFetch(url, options)
  }

  const patch = (url, options = {}) => {
    options.method = 'PATCH'
    return customFetch(url, options)
  }

  const del = (url, options = {}) => {
    options.method = 'DELETE'
    return customFetch(url, options)
  }

  return {
    get,
    post,
    put,
    del,
    patch
  }
}
