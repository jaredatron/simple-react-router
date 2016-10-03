import chai from 'chai'
const { expect } = chai
import React from 'react'
import { mount, shallow } from 'enzyme';

import SimpleReactRouter from '..'

const HomePage = (props) => <div>HomePage</div>
const AboutPage = (props) => <div>AboutPage</div>
const PostShowPage = (props) => <div>PostShowPage</div>
const CatchAllPage = (props) => <div>CatchAllPage</div>

class MyRouter extends SimpleReactRouter {
  getRoutes(map){
    map('/',              HomePage)
    map('/about',         AboutPage)
    map('/posts/:postId', PostShowPage)
    map('*path',          CatchAllPage)
  }
}

const setPathname = (pathname) => {
  global.location = {
    pathname: pathname,
    search: undefined,
    hash: undefined,
  }
}

describe('MyRouter', () => {
  it('should be a React Component', () => {
    expect(MyRouter).to.be.a('function')
  })

  context('when at example.com/', () => {
    beforeEach(() => {
      setPathname('/')
    })
    it('should render HomePage', () => {
      const wrapper = mount(<MyRouter />);
      const instance = wrapper.node
      expect(instance.route).to.eql({
        params: {
          Component: HomePage,
        },
        location: {
          pathname: '/',
          query: {},
          search: undefined,
          hash: undefined,
        }
      })
      expect(wrapper.find(HomePage)).to.have.length(1)
      expect(wrapper.find(AboutPage)).to.have.length(0)
      expect(wrapper.find(PostShowPage)).to.have.length(0)
      expect(wrapper.find(CatchAllPage)).to.have.length(0)
    })
  })

  context('when at example.com/about', () => {
    beforeEach(() => {
      setPathname('/about')
    })
    it('should render AboutPage', () => {
      const wrapper = mount(<MyRouter />);
      const instance = wrapper.node
      expect(instance.route).to.eql({
        params: {
          Component: AboutPage,
        },
        location: {
          pathname: '/about',
          query: {},
          search: undefined,
          hash: undefined,
        }
      })
      expect(wrapper.find(HomePage)).to.have.length(0)
      expect(wrapper.find(AboutPage)).to.have.length(1)
      expect(wrapper.find(PostShowPage)).to.have.length(0)
      expect(wrapper.find(CatchAllPage)).to.have.length(0)
    })
  })

  context('when at example.com/posts/1234', () => {
    beforeEach(() => {
      setPathname('/posts/1234')
    })
    it('should render AboutPage', () => {
      const wrapper = mount(<MyRouter />);
      const instance = wrapper.node
      expect(instance.route).to.eql({
        params: {
          Component: PostShowPage,
          postId: '1234',
        },
        location: {
          pathname: '/posts/1234',
          query: {},
          search: undefined,
          hash: undefined,
        }
      })
      expect(wrapper.find(HomePage)).to.have.length(0)
      expect(wrapper.find(AboutPage)).to.have.length(0)
      expect(wrapper.find(PostShowPage)).to.have.length(1)
      expect(wrapper.find(CatchAllPage)).to.have.length(0)
    })
  })


  context('when at example.com/broken/link', () => {
    beforeEach(() => {
      setPathname('/broken/link')
    })
    it('should render AboutPage', () => {
      const wrapper = mount(<MyRouter />);
      const instance = wrapper.node
      expect(instance.route).to.eql({
        params: {
          Component: CatchAllPage,
          path: 'broken/link',
        },
        location: {
          pathname: '/broken/link',
          query: {},
          search: undefined,
          hash: undefined,
        }
      })
      expect(wrapper.find(HomePage)).to.have.length(0)
      expect(wrapper.find(AboutPage)).to.have.length(0)
      expect(wrapper.find(PostShowPage)).to.have.length(0)
      expect(wrapper.find(CatchAllPage)).to.have.length(1)
    })
  })

})
