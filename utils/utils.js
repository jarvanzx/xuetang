import exp from 'constants'
import {
  IMG_BASE_URL,
  IMG_URL
} from '../config/env.js'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const handleImagePath = (url) => {
  // console.log('handleImagePath', url, IMG_URL)
  if (!url) return ''
  if (url.indexOf(IMG_URL) > -1) {
    return url
  }
  if (url.indexOf('120.79.97.130:8080') > -1) {
    return url
  }
  return IMG_URL + url
}
const handleAge = (age) => {
  age = age * 1
  if (age > 200) {
    return new Date().getFullYear() - age
  }
  return age
}

const getUrl = (url) => {
  if (/^http/.test(url)) {
    return url
  }
  return IMG_BASE_URL + url
}
export {
  formatTime,
  handleImagePath,
  handleAge,
  getUrl
}