# simple-react-router

[![Join the chat at https://gitter.im/simple-react-router/Lobby](https://badges.gitter.im/simple-react-router/Lobby.svg)](https://gitter.im/simple-react-router/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Why

React Router is too complex. Most of my projects just need a simple top level router.

## Usage

#### Static Routes

To create a static router simply subclass from `SimpleReactRouter` and define the `routes()` method.

```js
import React from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import LogoutPage from './components/LogoutPage'
import PostIndexPage from './components/PostIndexPage'
import NewPostPage from './components/NewPostPage'
import PostShowPage from './components/PostShowPage'
import PostEditPage from './components/PostEditPage'

export default class Router extends SimpleReactRouter {
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
```

#### Dynamic Routes

To use dynamic routes define `getRoute()` instead of `routes()` and you're routes will be calculated every time the `Router` component is constructed or receives props.


```js
import React from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import LogoutPage from './components/LogoutPage'
import PostIndexPage from './components/PostIndexPage'
import NewPostPage from './components/NewPostPage'
import PostShowPage from './components/PostShowPage'
import PostEditPage from './components/PostEditPage'

export default class Router extends SimpleReactRouter {
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
```

## Path Expressions

The route expressions are parsed with [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
via [pathname-router](https://github.com/deadlyicon/pathname-router)


## Links


```js
import { Link } from 'simple-react-router'

<Link href="/local/path">Home</Link>
<Link href="http://external.com/link">Home</Link>

```
