import {Link} from './Link';

export default function ButtonLink(props){
  return <Link Component="button" {...props} />{props.children}</Link>
}