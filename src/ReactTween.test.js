import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>')

global.window = dom.window;
global.document = dom.window.document;

//import { ReactTween } from '../dist/index';
import ReactTween from './ReactTween';

let SimpleComponent, SimpleComponentTween;

describe('React Tween', function() {
	//setup before each test
	beforeEach(function(done){
		SimpleComponent = ({ tweenStyles }) => {
			return (
				<div className='simple' style={{...tweenStyles}}>Simple</div>
			);
		};

		SimpleComponentTween = ReactTween(SimpleComponent);
		done();
	});

	it('Exists', function() {
		const wrapper = shallow(<SimpleComponentTween />);
		expect(wrapper.length).toEqual(1);
	});

	it('It has correct timing props', function() {
		const props = { timing: 500 };

		const wrapper = shallow((<SimpleComponentTween {...props} />));
		expect(wrapper.props()).toInclude(props);
	});

});
