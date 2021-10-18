/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';

import { configure, shallow } from 'enzyme';

import LoginForm from './LoginForm.jsx';

configure({ adapter: new Adapter() });

describe('Login Form TDD Tests', () => {
  let container;

  beforeEach(() => {
    container = shallow(<LoginForm username={"steve"}/>);
  });

  it('should render a <div />', () => {
    expect(container.find('div').length).toEqual(1);
  });

  it('should have a field for username ', () => {
    expect(container.find('.user-name').length).toEqual(1);
  });

  it('should have a field for username ', () => {
    expect(container.find('.user-name').value).toEqual('steve');
  });


});