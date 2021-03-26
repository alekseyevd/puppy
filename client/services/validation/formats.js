export default {
  phone: (value) => {
    const x = value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/)
    let formatted

    if (x[1] == 9) {
      formatted = '7 ' + x[1] + (x[2] ? ' ' + x[2] : '') + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '')
    } else {
      formatted = !x[2] ? x[1] : x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '') + (x[5] ? ' ' + x[5] : '')
    }
    if (x[0].length == 11 && x[1] != 7) {
      formatted = '7 ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '') + (x[5] ? ' ' + x[5] : '')
    }

    return formatted
  }
}
