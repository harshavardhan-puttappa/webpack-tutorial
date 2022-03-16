import HelloWorldButton from './components/hello-world-button/hello-world-button';
import Heading from './components/heading/heading';
// import _ from 'lodash';
import React from 'react';

const heading = new Heading();
// heading.render(_.upperFirst('hello world'));
heading.render('hello world');

const helloWorld = new HelloWorldButton();
helloWorld.render();

if (process.env.NODE_ENV === 'production') {
  console.log('production mode');
} else if (process.env.NODE_ENV === 'development') {
  console.log('Development mode');
}
