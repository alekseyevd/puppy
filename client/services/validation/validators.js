const validators = {
  required(value) {
    return value.trim() !== ''
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
    return match && value === match[0];
  },

  // to-do min and max date
  date(value, options) {
    return (value instanceof Date && !isNaN(value)) || new Date(value) instanceof Date
  },

  hasProperty(value, options) {
    return Object.prototype.hasOwnProperty.call(value, options)
  }
}

export default validators
