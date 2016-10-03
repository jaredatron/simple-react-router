import React, { Component } from 'react'
import querystring from 'querystring'
import PathnameRouter from 'pathname-router'

export default class SimpleReactRouter extends Component {
  constructor(props){
    super()
    this.popstate = this.popstate.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    this.update()
  }

  update() {
    this.location = {
      pathname: location.pathname,
      search: location.search,
      query: searchToObject(location.search),
      hash: location.hash,
    }
    this.route = this.router(this.location)
  }

  router(location){
    const routes = new PathnameRouter
    this.getRoutes((path, Component) => routes.map(path, {Component}))
    return routes.resolve(location)
  }

  getRoutes(map){
    map('*path', (props) =>
      React.createElement('span', null, 'you must define getRoutes() in your subclass of SimpleReactRouter')
    )
  }

  componentDidMount(){
    // bind to push state event
    addEventListener('popstate', this.popstate)
  }

  componentWillUnmount(){
    removeEventListener('popstate', this.popstate)
  }

  popstate(event){
    this.update()
  }

  static childContextTypes = {
    route: React.PropTypes.object,
    redirectTo: React.PropTypes.func,
  }

  getChildContext(){
    return {
      route: this.route,
      redirectTo: this.redirectTo,
    }
  }

  redirectTo(path, query){

  }

  render(){
    if (!this.route){
      return React.createElement('span', null, 'No Route Found')
    }
    const { Component } = this.route.params
    return React.createElement(Component, {})
  }
}

const searchToObject = (search) => {
  return querystring.parse((search || '').replace(/^\?/, ''))
}


// const objectToSearch = (params) => {
//   var search = objectToQueryString(params);
//   return search.length === 0 ? '' : '?'+search;
// }

// const objectToQueryString = (params) => {
//   if (!params) return;
//   let pairs = []
//   Object.keys(params).forEach( key => {
//     let value = params[key]
//     if (value === true){
//       return pairs.push(encodeURIComponent(key));
//     }
//     if (value === false || value === null || value === undefined){
//       return;
//     }
//     pairs.push(encodeURIComponent(key)+'='+encodeURIComponent(value));
//   });
//   return pairs.join('&');
// }
