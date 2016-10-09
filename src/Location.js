import querystring from 'querystring'

export default class Location {
  constructor({pathname, query, hash}){
    this.pathname = pathname
    this.query = typeof query === 'string' ? searchToObject(query) : query
    this.hash = hash
  }

  toString(){
    let href = this.pathname
    let query = objectToSearch(this.query)
    if (query) href += '?'+query
    return href
  }

  update(location){
    const {pathname, query, hash} = this
    location = Object.assign({pathname, query, hash}, location)
    location = new Location(location)
    return location
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
