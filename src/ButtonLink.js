import {Link} from './Link';

class ButtonLink extends Link {
  renderElement(props) {
    return <button ref="link" {...props}>{props.children}</a>
  }
}

export default ButtonLink;