import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Link extends Component {

  static contextTypes = {
    redirectTo: PropTypes.func.isRequired,
    location:   PropTypes.object.isRequired,
  };

  static propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    href: PropTypes.string,
    path: PropTypes.string,
    onClick: PropTypes.func,
    externalLink: PropTypes.bool,
  };

  static defaultProps = {
    externalLink: false,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  isSameOrigin(){
    const { href } = this.props
    return !href.match(/^https?:\/\//) || href.startsWith(window.location.origin)
  }

  onClick(event){
    if (this.props.onClick){
      this.props.onClick(event)
    }

    if (event.defaultPrevented) return

    if (!this.props.externalLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && this.isSameOrigin()){
      event.preventDefault()
      this.context.redirectTo(this.props.href, !!this.props.replace)
    }
  }

  render(){
    const props = Object.assign({}, this.props)
    delete props.externalLink
    props.href = props.href || ''
    props.onClick = this.onClick
    return renderElement(props);
  }

  renderElement(props) {
    return <a ref="link" {...props}>{props.children}</a>
  }
}

export default Link
