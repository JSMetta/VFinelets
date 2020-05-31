import _ from 'lodash'
let baseUrl, entryUrl, loginUrl
let logout, getToken

function __getFinalUrl (url) {
  const finalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  return finalUrl
}

function __setHeadersAuthorization (headers) {
  const token = getToken()
  headers.Authorization = 'Bearer ' + token
}

async function __fetch (url, options) {
  const response = await fetch(url, options)
  if (response.ok) {
    const data = await response.json()
    return data
  } else if (response.status === 403) {
    // If the session is no longer valid, We logout
    logout()
  } else {
    const message = await response.text()
    const error = new Error(message)
    error.response = response
    throw error
  }
}

async function __sendHttp (url, method, data) {
  const options = {
    headers: {
      'Cache-Control': 'no-cache', // TODO: we should use cache in product mode
      'content-type': 'application/json'
    },
    method: method,
    body: data
  }
  __setHeadersAuthorization(options.headers)
  if (options.body && _.isObject(options.body)) {
    options.body = JSON.stringify(options.body)
  }
  const finalUrl = __getFinalUrl(url)
  const response = await __fetch(finalUrl, options)
  return response
}

export async function $get (url) {
  const response = await __sendHttp(url, 'GET')
  return response
}

export async function $entry () {
  const data = await $get(entryUrl)
  return data.links
}

export async function $post (url, data) {
  const response = await __sendHttp(url, 'POST', data)
  return response
}

export async function $login (data) {
  const user = await $post(loginUrl, data)
  return user
}

export async function $delete (url) {
  const finalUrl = __getFinalUrl(url)
  const options = {
    headers: {},
    method: 'DELETE'
  }
  __setHeadersAuthorization(options.headers)
  const {ok, status} = await fetch(finalUrl, options)
  return {ok, status}
}

export async function $put (url, version, data) {
  const finalUrl = __getFinalUrl(url)
  const options = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  if (version !== undefined && version !== null) {
    options.headers['If-Match'] = version
  }
  __setHeadersAuthorization(options.headers)

  const response = await fetch(finalUrl, options)
  if (response.status !== 200 && response.status !== 204) {
    const message = `Update failed, status code=${response.status}`
    const error = new Error(message)
    error.response = response
    throw error
  }
}

export async function $upload (url, formData) {
  const finalUrl = __getFinalUrl(url)
  const finalOptions = {
    headers: {},
    method: 'POST',
    body: formData
  }
  __setHeadersAuthorization(finalOptions.headers)
  const result = await fetch(finalUrl, finalOptions)
  return result
}

export default {
  install (Vue, options) {
    // Plugin options
    baseUrl = options.baseUrl
    entryUrl = options.entryUrl
    loginUrl = options.loginUrl
    logout = options.logout
    getToken = options.getToken
  }
}
