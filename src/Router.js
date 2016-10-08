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
    // console.log('Router initialized with', props)
    if (process.env.NODE_ENV === 'development'){
      if (this.routes && this.getRoutes)
        throw new Error('you cannot define both routes() and getRoutes()')
      if (!this.routes && !this.getRoutes)
        throw new Error('you must define either routes() or getRoutes()')
    }
    this.rerender = this.rerender.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    this.locationToHref = this.locationToHref.bind(this)

    if (this.routes){
      this.getRoute = createStaticRouter(this.routes)
    }else{
      this.getRoute = createDynamicRouter(this.getRoutes)
    }

    addEventListener('popstate', this.rerender)
    this.update(props)
  }

  componentWillUnmount(){
    removeEventListener('popstate', this.rerender)
  }

  componentWillReceiveProps(nextProps){
    this.update(nextProps)
  }

  rerender(event){
    this.update(this.props)
    this.forceUpdate()
  }

  update(props) {
    this.location = {
      pathname: location.pathname,
      search: location.search,
      query: searchToObject(location.search),
      hash: location.hash,
    }
    this.route = this.getRoute(this.location, props)
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
    // console.log(`--> Router.render ${Component.name}`, props)
    return React.createElement(Component, props)
  }
}

const createStaticRouter = (mapper) => {
  const router = createRouter(mapper)
  return (location) => router.resolve(location)
}

const createDynamicRouter = (mapper) =>
  (location, props) =>
    createRouter(mapper, props).resolve(location)

const createRouter = (mapper, props) => {
  const router = new PathnameRouter
  const map = (path, Component) => router.map(path, {Component})
  mapper.call(null, map, props)
  return router
}

const searchToObject = (search) => {
  return querystring.parse((search || '').replace(/^\?/, ''))
}

const objectToSearch = (object) => {
  return querystring.stringify(object)
}

export { Link, SimpleReactRouter }
