'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _enzyme = require('enzyme');

var _jsdom = require('jsdom');

var _ReactTween = require('./ReactTween');

var _ReactTween2 = _interopRequireDefault(_ReactTween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = new _jsdom.JSDOM('<!doctype html><html><body></body></html>');

global.window = dom.window;
global.document = dom.window.document;

//import { ReactTween } from '../dist/index';


var SimpleComponent = void 0,
    SimpleComponentTween = void 0;

describe('React Tween', function () {
	//setup before each test
	beforeEach(function (done) {
		SimpleComponent = function SimpleComponent(_ref) {
			var tweenStyles = _ref.tweenStyles;

			return _react2.default.createElement(
				'div',
				{ className: 'simple', style: _extends({}, tweenStyles) },
				'Simple'
			);
		};

		SimpleComponentTween = (0, _ReactTween2.default)(SimpleComponent);
		done();
	});

	it('Exists', function () {
		var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(SimpleComponentTween, null));
		(0, _expect2.default)(wrapper.length).toEqual(1);
	});

	it('It has correct timing props', function () {
		var props = { timing: 500 };

		var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(SimpleComponentTween, props));
		(0, _expect2.default)(wrapper.props()).toInclude(props);
	});
});