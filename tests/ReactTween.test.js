import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>')

global.window = dom.window;
global.document = dom.window.document;
global.window.requestAnimationFrame = function(callback) {
	return setTimeout(() => {callback()}, 16);
};
global.window.cancelAnimationFrame = function(frame) {
	clearInterval(frame);
};

import { ReactTween } from '../dist/index';

let SimpleComponent, SimpleComponentTween;

const ParentComponent = ({children}) => {
	return (
		<span>{children}</span>
	);
};

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

	it('Exists', function(done) {
		const wrapper = shallow(<SimpleComponentTween />);
		expect(wrapper.length).toEqual(1);
		done();
	});

	it('It has correct start tween props', function(done) {
		const beforeProps = { timing: 500, left: '0px', width: '0px'};

		const wrapper = mount((
			<SimpleComponentTween {...beforeProps} />
		));

		//confirm the start state
		expect(wrapper.find('.simple').props()).toInclude({
			style: {
				left: beforeProps.left,
				width: beforeProps.width
			}
		});
		done();
	});

	it('It has correct start and end tween props', function(done) {
		const beforeProps = { timing: 200, left: '0px', width: '0px'};
		const afterProps = { timing: 200, left: '3px', width: '100px'};

		const wrapper = mount((
			<SimpleComponentTween {...beforeProps} />
		));

		//confirm the start state
		expect(wrapper.find('.simple').props().style).toInclude({
			left: beforeProps.left,
			width: beforeProps.width
		});

		wrapper.setProps(afterProps);

		//confirm the end state
		setTimeout(() => {
			expect(wrapper.find('.simple').props().style).toInclude({
				left: afterProps.left,
				width: afterProps.width
			});
			done();
		}, 220);
	});

	it('It tweens between start and end states', function(done) {
		const beforeProps = { timing: 200, opacity: '0'};
		const afterProps = { timing: 200, opacity: '1'};

		const wrapper = mount((
			<SimpleComponentTween {...beforeProps} />
		));

		expect(wrapper.find('.simple').props().style).toInclude({
			opacity: beforeProps.opacity,
		});

		wrapper.setProps(afterProps);

		//confirm the inbetween status
		setTimeout(() => {
			expect(wrapper.find('.simple').props().style.opacity*1000).toBeGreaterThan(beforeProps.opacity*1000, 'Value is not increasing');
			expect(wrapper.find('.simple').props().style.opacity*1000).toBeLessThan(afterProps.opacity*1000, 'Value skipped to the end');
		}, 100);


		//confirm the end result. Had to round to convert the float to int for comparsion
		setTimeout(() => {
			expect(Math.round(wrapper.find('.simple').props().style.opacity)).toEqual(afterProps.opacity);
			done()
		}, 230);
	});

	it('It has default props', function(done) {
		const beforeProps = { opacity: '0'};

		const wrapper = mount((
			<SimpleComponentTween {...beforeProps} />
		));

		expect(wrapper.props()).toInclude({
			timing: 500
		});

		done()
	});
});
