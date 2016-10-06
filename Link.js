import React, { Component } from 'react'

class Link extends Component {

  static contextTypes = {
    redirectTo:     React.PropTypes.func,
    locationToHref: React.PropTypes.func,
  }

  static propTypes = {
    to:      React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
    href:    React.PropTypes.string,
    path:    React.PropTypes.string,
    onClick: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event){
    const href = this.refs.link.href

    if (this.props.onClick){
      this.props.onClick(event)
    }

    if (event.defaultPrevented) return;

    if (href.startsWith(location.origin)){
      event.preventDefault()
      this.context.redirectTo(href, !!this.props.replace)
    }

  }

  render(){
    const props = Object.assign({}, this.props)
    props.href = props.href || this.context.locationToHref(props.to) || ''
    props.onClick = this.onClick
    return <a ref="link" {...props}>{props.children}</a>
  }

}

export default Link
