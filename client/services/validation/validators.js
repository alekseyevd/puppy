const validators = {
  required(value) {
    if (typeof value === 'string') return value.trim() !== ''

    if (value === null || value === undefined) return false

    return true
  },

  empty(value) {
    if (value === null) return true

    if (typeof (value) === 'string') return value.trim() === ''
  },

  email(value) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase())
  },

  match(value, regex) {
    const r = new RegExp(regex)
    const match = value.match(r);
    if (!match) return false
    return match && value === match[0];
  },

  // to-do min and max date
  date(value, options) {
    return (value instanceof Date && !isNaN(value)) || Date.parse(value)
  },

  hasProperty(value, options) {
    if (typeof value !== 'object' || value === null) return false
    return Object.prototype.hasOwnProperty.call(value, options)
  }
}

export default validators
