module.exports = (schema) => {
  const textSearchfields = Object.keys(schema.obj)
      .filter(key => schema.obj[key].fastSearch)

  if (textSearchfields.length > 0) {
    schema.index(textSearchfields.reduce((acc, key) => (acc[key] = 'text', acc), {}))
  }

  schema.static('search', function(q) {
    // to-do q.search.split(' ')
    if (q.search && textSearchfields.length > 0) {
      // q.$or = [
      //   { login: new RegExp(q.search, 'i') },
      //   { email: new RegExp(q.search, 'i')}
      // ]
      q.$or = textSearchfields.map(key => ({[key]: new RegExp(q.search, 'i')}))
      delete q.search
    }

    return this.find(q)
  });
}
