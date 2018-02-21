import querystring from 'querystring'

export default class Location {
  constructor({pathname, query, search, hash}){
    this.pathname = pathname
    this.query = typeof search === 'string'
      ? searchToObject(search)
      : query || {}
    this.hash = hash === "" ? null : hash
  }

  toString(){
    let href = this.pathname
    let query = objectToSearch(this.query)
    if (query) href += '?'+query
    return href
  }

  update({pathname, query, hash}){
    return new Location({
      pathname: pathname || this.pathname,
      query: query || this.query,
      hash: hash || this.hash,
    })
  }

  hrefFor(location) {
    return this.update(location).toString()
  }
}


const searchToObject = (search) => {
  return querystring.parse((search || '').replace(/^\?/, ''))
}

const objectToSearch = (object) => {
  return querystring.stringify(object)
}
