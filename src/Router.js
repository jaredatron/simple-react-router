import React, { Component } from 'react'
import PathnameRouter from 'pathname-router'
import Location from './Location'

export default class SimpleReactRouter extends Component {

  static childContextTypes = {
    location:   React.PropTypes.object.isRequired,
    redirectTo: React.PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    if (process.env.NODE_ENV === 'development'){
      if (this.routes && this.getRoutes)
        throw new Error('you cannot define both routes() and getRoutes()')
      if (!this.routes && !this.getRoutes)
        throw new Error('you must define either routes() or getRoutes()')
    }

    this.router = new Router({
      component: this,
      staticRoutes: !!this.routes,
      getRoutes: this.routes || this.getRoutes
    })
  }

  componentWillUnmount(){
    this.router.unmount()
  }

  componentWillReceiveProps(nextProps){
    this.router.update(nextProps)
  }

  getChildContext() {
    return {
      location: this.router.location,
      redirectTo: this.router.redirectTo,
    }
  }

  render(){
    const { router } = this
    if (!router.location.params){
      return React.createElement('span', null, 'No Route Found')
    }
    const { Component } = router.location.params
    const props = Object.assign({}, this.props)
    props.location = router.location
    return React.createElement(Component, props)
  }
}



class Router {
  constructor({component, staticRoutes, getRoutes}){
    this.component = component
    this.resolve = staticRoutes ?
      staticResolver(getRoutes) :
      dynamicResolver(getRoutes)
    this.rerender = this.rerender.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    addEventListener('popstate', this.rerender)
    this.update(component.props)
  }

  update(props=this.component.props){
    this.location = new Location(location)
    this.location.params = this.resolve(this.location, props)
    this.component.location = this.location
  }

  rerender(){
    this.update()
    this.component.forceUpdate()
  }

  redirectTo(href, replace){
    if (replace){
      history.replaceState(null, document.title, href)
    }else{
      history.pushState(null, document.title, href)
    }
    this.rerender()
  }

  unmount(){
    removeEventListener('popstate', this.rerender)
  }
}

const staticResolver = (mapper) => {
  const router = instantiatePathnameRouter(mapper)
  return (location) => router.resolve(location.pathname)
}

const dynamicResolver = (mapper) => {
  return (location, props) =>
    instantiatePathnameRouter(mapper, props).resolve(location.pathname)
}

const instantiatePathnameRouter = (mapper, props) => {
  const router = new PathnameRouter
  const map = (path, Component, params={}) =>
    router.map(path, {Component, ...params})
  mapper.call(null, map, props)
  return router
}
