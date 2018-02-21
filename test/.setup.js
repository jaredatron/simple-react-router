require('babel-register')();

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;


// var exposedProperties = ['window', 'navigator', 'document'];

global.jsdom = jsdom;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

// Object.defineProperty(window.location, 'pathname', {
//   writable: true,
//   value: '/'
// });

// Object.defineProperty(window.location, 'search', {
//   writable: true,
//   value: ''
// });

// Object.defineProperty(window.location, 'hash', {
//   writable: true,
//   value: ''
// });

// Object.defineProperty(window.location, 'query', {
//   writable: true,
//   value: ''
// });


Object.getOwnPropertyNames(window)
  .filter(prop => typeof global[prop] === 'undefined')
  .forEach(prop => {
    Object.defineProperties(global, {
      [prop]: Object.getOwnPropertyDescriptor(window, prop)
    });
  })

documentRef = document;
