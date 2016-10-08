import URL from 'url'
import querystring from 'querystring'
import chai from 'chai'
const { expect } = chai
import React from 'react'
import { mount, shallow, render} from 'enzyme';

import SimpleReactRouter from '../src/Router'

const only = (block) => context.only('', block)

const setPathname = (path) => {
  let { pathname, search, hash } = URL.parse(path)

  global.location = {
    pathname,
    search,
    hash,
    query: querystring.parse((search || '').replace(/^\?/, '')),
  }
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
      setPathname(path)
    })
    block()
  })
}

const itShouldRouteTo = (expectedRoute) => {
  it('the routes should equal {...}', () => {
    const route = mount(subject).node.route
    expect(route).to.eql(expectedRoute)
  })
}

const itShouldRender = (Component) => {
  it(`should render <${Component.name} />`, () => {
    const mountedRouter = mount(subject)
    const {params, location} = mountedRouter.node.route
    const props = Object.assign({}, mountedRouter.node.props, {params, location})
    const expectedHTML = render(<Component {...props} />).html()
    expect(render(subject).html()).to.eql(expectedHTML)
  })
}




const NotFound      = (props) => <div>NotFound {props.params.path}</div>
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
    map('*path',               NotFound) // catchall route
  }
}


describe('StaticRouter', () => {

  setSubject(() => <StaticRouter />)

  itShouldBeAReactComponent(StaticRouter)

  whenAt('/', () => {

    itShouldRouteTo({
      params: {
        Component: HomePage,
      },
      location: {
        pathname: '/',
        query: {},
        search: null,
        hash: null,
      }
    })

    itShouldRender(HomePage)

  })

  whenAt('/signup', () => {

    itShouldRouteTo({
      params: {
        Component: SignupPage,
      },
      location: {
        pathname: '/signup',
        query: {},
        search: null,
        hash: null,
      }
    })

    itShouldRender(SignupPage)

  })

  whenAt('/login?return=/about#pricing', () => {

    itShouldRouteTo({
      params: {
        Component: LoginPage,
      },
      location: {
        pathname: '/login',
        query: {
          "return": "/about"
        },
        search: "?return=/about",
        hash: "#pricing",
      }
    })

    itShouldRender(LoginPage)

  })

  whenAt('/posts/42', () => {

    itShouldRouteTo({
      params: {
        Component: PostShowPage,
        postId: "42",
      },
      location: {
        pathname: '/posts/42',
        query: {},
        search: null,
        hash: null,
      }
    })

    itShouldRender(PostShowPage)

  })

  whenAt('/posts/88/edit', () => {

    itShouldRouteTo({
      params: {
        Component: PostEditPage,
        postId: "88",
      },
      location: {
        pathname: '/posts/88/edit',
        query: {},
        search: null,
        hash: null,
      }
    })

    itShouldRender(PostEditPage)

  })

  whenAt('/some/unknown/path', () => {

    itShouldRouteTo({
      params: {
        Component: NotFound,
        path: 'some/unknown/path',
      },
      location: {
        pathname: '/some/unknown/path',
        query: {},
        search: null,
        hash: null,
      }
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
    map('*path',          NotFound) // catchall route
  }
}


describe('DynamicRouter', () => {

  context('when not logged in', () => {
    setSubject(() => <DynamicRouter loggedIn={false} /> )


    whenAt('/', () => {

      itShouldRouteTo({
        params: {
          Component: LoggedOutHomePage,
        },
        location: {
          pathname: '/',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(LoggedOutHomePage)

    })

    whenAt('/signup', () => {

      itShouldRouteTo({
        params: {
          Component: SignupPage,
        },
        location: {
          pathname: '/signup',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(SignupPage)

    })

    whenAt('/login', () => {

      itShouldRouteTo({
        params: {
          Component: LoginPage,
        },
        location: {
          pathname: '/login',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(LoginPage)

    })

    whenAt('/posts', () => {

      itShouldRouteTo({
        params: {
          Component: PostIndexPage,
        },
        location: {
          pathname: '/posts',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(PostIndexPage)

    })

    whenAt('/posts/88/edit', () => {

      itShouldRouteTo({
        params: {
          Component: NotFound,
          path: 'posts/88/edit'
        },
        location: {
          pathname: '/posts/88/edit',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(NotFound)

    })


    whenAt('/posts/42', () => {

      itShouldRouteTo({
        params: {
          Component: PostShowPage,
          postId: "42",
        },
        location: {
          pathname: '/posts/42',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(PostShowPage)

    })


    whenAt('/some/unknown/path', () => {

      itShouldRouteTo({
        params: {
          Component: NotFound,
          path: 'some/unknown/path',
        },
        location: {
          pathname: '/some/unknown/path',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(NotFound)

    })

  })

  context('when logged in', () => {
    setSubject(() => <DynamicRouter loggedIn={true} /> )

    whenAt('/', () => {

      itShouldRouteTo({
        params: {
          Component: LoggedInHomePage,
        },
        location: {
          pathname: '/',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(LoggedInHomePage)

    })

    whenAt('/signup', () => {

      itShouldRouteTo({
        params: {
          Component: NotFound,
          path: 'signup'
        },
        location: {
          pathname: '/signup',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(NotFound)

    })

    whenAt('/login', () => {

      itShouldRouteTo({
        params: {
          Component: NotFound,
          path: 'login'
        },
        location: {
          pathname: '/login',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(NotFound)

    })

    whenAt('/posts', () => {

      itShouldRouteTo({
        params: {
          Component: PostIndexPage,
        },
        location: {
          pathname: '/posts',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(PostIndexPage)

    })

    whenAt('/posts/88/edit', () => {

      itShouldRouteTo({
        params: {
          Component: PostEditPage,
          postId: '88'
        },
        location: {
          pathname: '/posts/88/edit',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(PostEditPage)

    })


    whenAt('/posts/42', () => {

      itShouldRouteTo({
        params: {
          Component: PostShowPage,
          postId: "42",
        },
        location: {
          pathname: '/posts/42',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(PostShowPage)

    })


    whenAt('/some/unknown/path', () => {

      itShouldRouteTo({
        params: {
          Component: NotFound,
          path: 'some/unknown/path',
        },
        location: {
          pathname: '/some/unknown/path',
          query: {},
          search: null,
          hash: null,
        }
      })

      itShouldRender(NotFound)

    })
  })

})

