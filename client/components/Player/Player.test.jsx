import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import Player from './Player.jsx';

configure({ adapter: new Adapter() });

describe('Player component should exist', () => {
  let container;

  beforeEach(() => {
    container = shallow(<Player />);
  });

  it('should render a <div />', () => {
    expect(container.find('div').length).toEqual(1);
  });
});