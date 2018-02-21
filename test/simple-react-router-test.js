import URL from 'url'
import querystring from 'querystring'
import chai from 'chai'
const { expect } = chai
import React from 'react'
import ReactDOM from 'react-dom'
import Enzyme, { mount, shallow, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() });


import SimpleReactRouter from '../src/Router'

const only = (block) => context.only('', block)

const setPath = (path) => {
  let { pathname, search, hash } = URL.parse(path)
  jsdom.reconfigure({
    url: "https://www.example.com/"+path
  });
  // global.location.pathname = pathname
  // global.location.search = search
  // global.location.hash = hash
  // global.location.query = querystring.parse((search || '').replace(/^\?/, ''))
}

let subject = null

const setSubject = (subjectGetter) => {
  beforeEach(() => {
    subject = subjectGetter()
  })
}

const itShouldBeAReactComponent = (component) => {
  it('should be a React Component', () => {
    expect(component).to.be.a('function')
  })
}

const whenAt = (path, block) => {
  const url = URL.parse(path)
  context(`when at ${path}`, () => {
    beforeEach(() => {
      setPath(path)
    })
    block()
  })
}

const itShouldRouteTo = (expectedRoute) => {
  it(`should route to ${JSON.stringify(expectedRoute)}`, () => {
    const location = mount(subject).instance().location
    console.log({location, expectedRoute})
    expect(location).to.eql(expectedRoute)
  })
}

const itShouldRender = (Component) => {
  it(`should render <${Component.name} />`, () => {
    const mountedRouter = mount(subject)
    const props = Object.assign({}, mountedRouter.instance().props)
    props.location = mountedRouter.instance().location
    const expectedHTML = render(<Component {...props} />).html()
    expect(render(subject).html()).to.eql(expectedHTML)
  })
}




const NotFound      = (props) => <div>NotFound {props.location.params.path}</div>
const HomePage      = (props) => <div>HomePage</div>
const SignupPage    = (props) => <div>SignupPage</div>
const LoginPage     = (props) => <div>LoginPage</div>
const LogoutPage    = (props) => <div>LogoutPage</div>
const PostIndexPage = (props) => <div>PostIndexPage</div>
const NewPostPage   = (props) => <div>NewPostPage</div>
const PostShowPage  = (props) => <div>PostShowPage</div>
const PostEditPage  = (props) => <div>PostEditPage</div>

export default class StaticRouter extends SimpleReactRouter {
  routes(map){
    map('/',                   HomePage)
    map('/signup',             SignupPage)
    map('/login',              LoginPage)
    map('/logout',             LogoutPage)
    map('/posts',              PostIndexPage)
    map('/posts/new',          NewPostPage)
    map('/posts/:postId',      PostShowPage)
    map('/posts/:postId/edit', PostEditPage)
    map('/:path*',             NotFound) // catchall route
  }
}


describe('StaticRouter', () => {

  setSubject(() => <StaticRouter />)

  itShouldBeAReactComponent(StaticRouter)

  whenAt('/', () => {
    itShouldRouteTo({
      pathname: '/',
      query: {},
      hash: null,
      params: {
        Component: HomePage,
      },
    })

    itShouldRender(HomePage)

  })

  whenAt('/signup', () => {

    itShouldRouteTo({
      pathname: '/signup',
      query: {},
      hash: null,
      params: {
        Component: SignupPage,
      },
    })

    itShouldRender(SignupPage)

  })

  whenAt('/login?return=/about#pricing', () => {

    itShouldRouteTo({
      pathname: '/login',
      query: {
        "return": "/about"
      },
      hash: "#pricing",
      params: {
        Component: LoginPage,
      },
    })

    itShouldRender(LoginPage)

  })

  whenAt('/posts/42', () => {

    itShouldRouteTo({
      pathname: '/posts/42',
      query: {},
      hash: null,
      params: {
        Component: PostShowPage,
        postId: "42",
      },
    })

    itShouldRender(PostShowPage)

  })

  whenAt('/posts/88/edit', () => {

    itShouldRouteTo({
      pathname: '/posts/88/edit',
      query: {},
      hash: null,
      params: {
        Component: PostEditPage,
        postId: "88",
      },
    })

    itShouldRender(PostEditPage)

  })

  whenAt('/some/unknown/path', () => {

    itShouldRouteTo({
      pathname: '/some/unknown/path',
      query: {},
      hash: null,
      params: {
        Component: NotFound,
        path: 'some/unknown/path',
      },
    })

    itShouldRender(NotFound)

  })


})






const LoggedInHomePage  = (props) => <div>LoggedInHomePage</div>
const LoggedOutHomePage = (props) => <div>LoggedOutHomePage</div>

class DynamicRouter extends SimpleReactRouter {
  getRoutes(map, props){
    const { loggedIn } = props
    if (loggedIn){
      map('/',                   LoggedInHomePage)
      map('/logout',             LogoutPage)
      map('/posts/new',          NewPostPage)
      map('/posts/:postId/edit', PostEditPage)
    } else {
      map('/',       LoggedOutHomePage)
      map('/signup', SignupPage)
      map('/login',  LoginPage)
    }
    map('/posts',         PostIndexPage)
    map('/posts/:postId', PostShowPage)
    map('/:path*',        NotFound) // catchall route
  }
}


describe('DynamicRouter', () => {

  context('when not logged in', () => {
    setSubject(() => <DynamicRouter loggedIn={false} /> )

    whenAt('/', () => {

      itShouldRouteTo({
        pathname: '/',
        query: {},
        hash: null,
        params: {
          Component: LoggedOutHomePage,
        },
      })

      itShouldRender(LoggedOutHomePage)

    })

    whenAt('/signup', () => {

      itShouldRouteTo({
        pathname: '/signup',
        query: {},
        hash: null,
        params: {
          Component: SignupPage,
        },
      })

      itShouldRender(SignupPage)

    })

    whenAt('/login', () => {

      itShouldRouteTo({
        pathname: '/login',
        query: {},
        hash: null,
        params: {
          Component: LoginPage,
        },
      })

      itShouldRender(LoginPage)

    })

    whenAt('/posts', () => {

      itShouldRouteTo({
        pathname: '/posts',
        query: {},
        hash: null,
        params: {
          Component: PostIndexPage,
        },
      })

      itShouldRender(PostIndexPage)

    })

    whenAt('/posts/88/edit', () => {

      itShouldRouteTo({
        pathname: '/posts/88/edit',
        query: {},
        hash: null,
        params: {
          Component: NotFound,
          path: 'posts/88/edit'
        },
      })

      itShouldRender(NotFound)

    })


    whenAt('/posts/42', () => {

      itShouldRouteTo({
        pathname: '/posts/42',
        query: {},
        hash: null,
        params: {
          Component: PostShowPage,
          postId: "42",
        },
      })

      itShouldRender(PostShowPage)

    })


    whenAt('/some/unknown/path', () => {

      itShouldRouteTo({
        pathname: '/some/unknown/path',
        query: {},
        hash: null,
        params: {
          Component: NotFound,
          path: 'some/unknown/path',
        },
      })

      itShouldRender(NotFound)

    })

  })

  context('when logged in', () => {
    setSubject(() => <DynamicRouter loggedIn={true} /> )

    whenAt('/', () => {

      itShouldRouteTo({
        pathname: '/',
        query: {},
        hash: null,
        params: {
          Component: LoggedInHomePage,
        },
      })

      itShouldRender(LoggedInHomePage)

    })

    whenAt('/signup', () => {

      itShouldRouteTo({
        pathname: '/signup',
        query: {},
        hash: null,
        params: {
          Component: NotFound,
          path: 'signup',
        }
      })

      itShouldRender(NotFound)

    })

    whenAt('/login', () => {

      itShouldRouteTo({
        pathname: '/login',
        query: {},
        hash: null,
        params: {
          Component: NotFound,
          path: 'login'
        },
      })

      itShouldRender(NotFound)

    })

    whenAt('/posts', () => {

      itShouldRouteTo({
        pathname: '/posts',
        query: {},
        hash: null,
        params: {
          Component: PostIndexPage,
        },
      })

      itShouldRender(PostIndexPage)

    })

    whenAt('/posts/88/edit', () => {

      itShouldRouteTo({
        pathname: '/posts/88/edit',
        query: {},
        hash: null,
        params: {
          Component: PostEditPage,
          postId: '88'
        },
      })

      itShouldRender(PostEditPage)

    })


    whenAt('/posts/42', () => {

      itShouldRouteTo({
        pathname: '/posts/42',
        query: {},
        hash: null,
        params: {
          Component: PostShowPage,
          postId: "42",
        },
      })

      itShouldRender(PostShowPage)

    })


    whenAt('/some/unknown/path', () => {

      itShouldRouteTo({
        pathname: '/some/unknown/path',
        query: {},
        hash: null,
        params: {
          Component: NotFound,
          path: 'some/unknown/path',
        },
      })

      itShouldRender(NotFound)

    })
  })

})

describe('Location', () => {

  // stub history.replaceState / pushState

  let location
  beforeEach(() => {
    setPath('/posts/23/edit?order=desc')
    const mountPoint = mount(<StaticRouter />)
    location = mountPoint.instance().location
  })

  it('should', ()=> {
    expect(location).to.eql({
      pathname: '/posts/23/edit',
      query: {
        "order": "desc",
      },
      hash: null,
      params: {
        Component: PostEditPage,
        postId: '23'
      },
    })

    expect(location.toString()).to.eql('/posts/23/edit?order=desc')

    expect(location.hrefFor({})).to.eql('/posts/23/edit?order=desc')

    expect(location.hrefFor({
      pathname: '/foo/bar'
    })).to.eql('/foo/bar?order=desc')

    expect(location.hrefFor({
      pathname: '/foo/bar',
      query: {order: 'asc'},
    })).to.eql('/foo/bar?order=asc')

  })



})
