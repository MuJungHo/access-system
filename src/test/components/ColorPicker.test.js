import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { shallow, configure } from 'enzyme';
import ColorPicker from '../../components/ColorPicker'

configure({ adapter: new Adapter() });

describe('ColorPicker', () => {
  const colors = ['#4A90E2', '#4ACAAD', '#9759CD', '#F6B03C', '#EE6778', '#4A4A4A']
  const component = shallow(<ColorPicker colors={colors} />);
  it('should match the snapshot', () => {
    expect(component.html()).toMatchSnapshot();
  });
})