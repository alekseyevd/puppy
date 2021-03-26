import formats from './formats'

export default function format(value, formation) {
  if (!formation) return value

  if (typeof formation === 'string') {
    return formats[formation](value)
  } else if ({}.toString.call(formation) === '[object Function]') {
    // to-do try catch ?
    return formation(value)
  }

  return value
}
