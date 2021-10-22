import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import Controls from './Controls.jsx';

configure({ adapter: new Adapter() });

describe('Controls component should exist', () => {
  let container;

  beforeEach(() => {
    container = shallow(<Controls />);
  });

  it('should render a <div />', () => {
    expect(container.find('div').length).toEqual(1);
  });
});