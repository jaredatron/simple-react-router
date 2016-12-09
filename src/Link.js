import React, { Component, PropTypes } from 'react'

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

  onClick(event){
    const href = this.refs.link.href

    if (this.props.onClick){
      this.props.onClick(event)
    }

    if (event.isDefaultPrevented() || event.isPropagationStopped()) return

    if (!this.props.externalLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && href.startsWith(location.origin)){
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
