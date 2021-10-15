/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import App from './App.jsx';

configure({ adapter: new Adapter() });

describe('App test / example testing', () => {
  let container;

  beforeEach(() => {
    container = shallow(<App />);
  });

  it('should render a <div />', () => {
    expect(container.find('div').length).toEqual(1);
  });


});