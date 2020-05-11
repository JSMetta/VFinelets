import store from '../../src/store'
import _ from 'lodash'
let baseUrl, entryUrl, loginUrl

async function __fetch (url, options) {
  const response = await fetch(url, options)
  if (response.ok) {
    const data = await response.json()
    return data
  } else if (response.status === 403) {
    // If the session is no longer valid, We logout
    store.dispatch('logout')
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
  let token = store.getters.token
  if (token) {
    options.headers.Authorization = 'Bearer ' + token
  }
  if (options.body && _.isObject(options.body)) {
    options.body = JSON.stringify(options.body)
  }

  const response = await __fetch(url, options)
  return response
}

export async function $entry () {
  const data = await $get(entryUrl)
  return data.links
}

export async function $get (url, data) {
  const finalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  const response = await __sendHttp(finalUrl, 'GET', data)
  return response
}

export async function $post (url, data) {
  const finalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  const response = await __sendHttp(finalUrl, 'POST', data)
  return response
}

export async function $delete (url) {
  const finalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  const options = {
    headers: {
      'Cache-Control': 'no-cache', // TODO: we should use cache in product mode
      'content-type': 'application/json'
    },
    method: 'DELETE'
  }
  let token = store.getters.token
  if (token) {
    options.headers.Authorization = 'Bearer ' + token
  }
  const {ok, status} = await fetch(finalUrl, options)
  return {ok, status}
}

export async function $put (url, version, data) {
  const finalUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
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
  let token = store.getters.token
  if (token) {
    options.headers.Authorization = 'Bearer ' + token
  }
  const response = await fetch(finalUrl, options)
  if (response.status !== 200 && response.status !== 204) {
    const message = `Update failed, status code=${response.status}`
    const error = new Error(message)
    error.response = response
    throw error
  }
}

export async function $upload (url, formData) {
  const finalOptions = {
    headers: {},
    method: 'POST',
    body: formData
  }
  let token = store.getters.token
  if (token) {
    finalOptions.headers.Authorization = 'Bearer ' + token
  }
  const result = await fetch(`${baseUrl}${url}`, finalOptions)
  return result
}

export async function $login (data) {
  const user = await __sendHttp(loginUrl, 'POST', data)
  return user
}

export default {
  install (Vue, options) {
    // Plugin options
    baseUrl = options.baseUrl
    entryUrl = options.entryUrl
    loginUrl = options.loginUrl
  }
}
