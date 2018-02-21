require('babel-register')();

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.jsdom = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

Object.getOwnPropertyNames(window)
  .filter(prop => typeof global[prop] === 'undefined')
  .forEach(prop => {
    // if (prop === 'location') return
    Object.defineProperties(global, {
      [prop]: Object.getOwnPropertyDescriptor(window, prop)
    });
  })

documentRef = document;
