import React, { Component } from 'react'

class Link extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func.isRequired,
    location:   React.PropTypes.object.isRequired,
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

    if (event.isDefaultPrevented() || event.isPropagationStopped()) return

    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && href.startsWith(location.origin)){
      event.preventDefault()
      this.context.redirectTo(href, !!this.props.replace)
    }
  }

  render(){
    const props = Object.assign({}, this.props)
    props.href = props.href || ''
    props.onClick = this.onClick
    return <a ref="link" {...props}>{props.children}</a>
  }

}

export default Link
