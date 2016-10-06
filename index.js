import React, { Component } from 'react'
import querystring from 'querystring'
import PathnameRouter from 'pathname-router'
import Link from './Link'

export default class SimpleReactRouter extends Component {

  static childContextTypes = {
    location:       React.PropTypes.object.isRequired,
    route:          React.PropTypes.object.isRequired,
    redirectTo:     React.PropTypes.func,
    locationToHref: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.rerender = this.rerender.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    this.locationToHref = this.locationToHref.bind(this)
    this.update()
    addEventListener('popstate', this.rerender)
  }

  componentWillUnmount(){
    removeEventListener('popstate', this.rerender)
  }

  rerender(event){
    this.update()
    this.forceUpdate()
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

  getChildContext() {
    return {
      location: this.location,
      route: this.route,
      redirectTo: this.redirectTo,
      locationToHref: this.locationToHref,
    }
  }

  redirectTo(href, replace){
    href = this.locationToHref(href)
    if (replace){
      history.replaceState(null, document.title, href)
    }else{
      history.pushState(null, document.title, href)
    }
    this.rerender()
  }

  locationToHref(location) {
    if (!location || typeof location === 'string') return location
    let href = location.pathname || this.location.pathname
    let query = location.query
    if (typeof query === 'object') query = objectToSearch(query)
    if (query) href += '?'+query
    return href
  }

  render(){
    if (!this.route){
      return React.createElement('span', null, 'No Route Found')
    }
    const { params, location } = this.route
    const { Component } = params
    const props = Object.assign({}, this.props, { params, location })
    return React.createElement(Component, props)
  }
}

const searchToObject = (search) => {
  return querystring.parse((search || '').replace(/^\?/, ''))
}

const objectToSearch = (object) => {
  return querystring.stringify(object)
}

export { Link, SimpleReactRouter }
