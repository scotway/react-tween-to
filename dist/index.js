'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var printMs = function printMs() {
	var d = new Date();
	var n = d.getMilliseconds();
	var s = d.getSeconds();
	//console.log('time -- ' + s + '.' + n);
};

var ReactTween = function ReactTween(WrappedComponent) {
	return function (_React$Component) {
		_inherits(_class, _React$Component);

		function _class(props) {
			_classCallCheck(this, _class);

			var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

			_this.msPs = 16.7; //60fps
			_this.requestFrameRef = false;
			_this.tweenPath = {};
			_this.tweenIterations = 0;

			_this.animationKeys = ['top', 'left', 'bottom', 'right', 'height', 'width', 'opacity', 'fontSize', 'zIndex'];

			_this.state = {
				timing: props.timing,
				easing: props.easing,
				frame: 0,
				top: props.top,
				left: props.left,
				bottom: props.bottom,
				fontSize: props.fontSize,
				right: props.right,
				height: props.height,
				width: props.width,
				opacity: props.opacity,
				zIndex: props.zIndex
			};
			return _this;
		}

		_createClass(_class, [{
			key: 'componentDidMount',
			value: function componentDidMount() {}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				var _this2 = this;

				printMs();
				//console.log('current', this.props);
				//console.log('next', nextProps);
				var timing = nextProps.timing || this.state.timing;
				var iterations = Math.round(timing / this.msPs);

				var currentStyles = _lodash2.default.omitBy(this.state, _lodash2.default.isUndefined);
				currentStyles = _lodash2.default.pick(currentStyles, this.animationKeys);

				var paths = _lodash2.default.map(currentStyles, function (data, key) {
					var json = {};

					var unitType = _this2.getUnitType(String(data));

					var oldValue = String(data).replace(unitType, '');
					var newValue = String(nextProps[key]).replace(unitType, '');

					var stylePath = [newValue + unitType];

					if (iterations > 0) {
						stylePath = _lodash2.default.times(iterations, function (i) {
							//the i + 1 makes sure that you get to the end value
							var nextValue = _this2.getCalculatedValue(i + 1, oldValue, newValue, iterations);

							if (unitType == 'px') {
								return Math.round(nextValue) + unitType;
							} else {
								return nextValue.toFixed(2) + unitType;
							}
						});
					}

					json['key'] = key;
					json['path'] = stylePath;

					return json;
				});

				this.tweenPath = paths;
				this.tweenIterations = iterations;
				this.state.frame = 0;

				window.cancelAnimationFrame(this.requestFrameRef);

				var currentFrame = this.getCurrentFrameState();

				//console.log(nextProps.timing);
				//console.log('FIRST', currentFrame, iterations, this.tweenPath, nextProps);

				//console.log('------');
				this.state = _extends({}, nextProps, currentFrame, { frame: 0 });
				//setTimeout(() => {
				//this.setState({...nextProps, ...currentFrame, frame: 0});
				//}, 0);
			}
		}, {
			key: 'componentDidUpdate',
			value: function componentDidUpdate() {
				if (this.state.frame < this.tweenIterations && !this.props.isPaused) {
					var currentFrame = this.getCurrentFrameState();

					this.requestFrameRef = window.requestAnimationFrame(this.loop.bind(this, currentFrame));

					//setTimeout(this.loop.bind(this), this.msPs);
				} else if (this.props.onComplete && this.state.frame == this.tweenIterations) {
					console.log(this.state.frame + ' ---- complete -----');
					printMs();
					this.props.onComplete();
				}
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				window.cancelAnimationFrame(this.requestFrameRef);
			}
		}, {
			key: 'loop',
			value: function loop(currentFrame) {
				this.setState(_extends({}, this.state, currentFrame));

				if (this.props.onUpdate) {
					this.props.onUpdate(this.state);
				}
			}
		}, {
			key: 'getUnitType',
			value: function getUnitType(value) {
				if (value.indexOf('%') > -1) {
					return '%';
				} else if (value.indexOf('px') > -1) {
					return 'px';
				} else if (value.indexOf('rem') > -1) {
					return 'rem';
				} else if (value.indexOf('em') > -1) {
					return 'em';
				} else {
					return '';
				}
			}
		}, {
			key: 'getCalculatedValue',
			value: function getCalculatedValue(frame, oldValue, newValue, iterations) {
				switch (this.state.easing) {
					case 'easeIn':
						return oldValue - (oldValue - newValue) * (Math.pow(frame, 4) / Math.pow(iterations, 4));
					case 'easeOut':
						return oldValue - (oldValue - newValue) * (1 - Math.pow(iterations - frame, 4) / Math.pow(iterations, 4));
					default:
						return oldValue - (oldValue - newValue) * (frame / iterations);
				}
			}
		}, {
			key: 'getCurrentFrameState',
			value: function getCurrentFrameState() {
				var _this3 = this;

				var frameState = {};
				_lodash2.default.map(this.tweenPath, function (data) {
					frameState[data.key] = data.path[_this3.state.frame];
				});

				frameState['frame'] = this.state.frame + 1;
				return frameState;
			}
		}, {
			key: 'render',
			value: function render() {
				var styles = _lodash2.default.omitBy(this.state, _lodash2.default.isUndefined);
				styles = _lodash2.default.pick(styles, this.animationKeys);

				return _react2.default.createElement(WrappedComponent, _extends({}, this.props, { tweenStyles: styles }));
			}
		}]);

		return _class;
	}(_react2.default.Component);
};

ReactTween.defaultProps = {
	timing: 500,
	easing: 'simple'
};

ReactTween.propTypes = {
	timing: _propTypes2.default.number.isRequired,
	easing: _propTypes2.default.string.isRequired,
	top: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	left: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	bottom: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	right: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	fontSize: _propTypes2.default.string,
	height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	opacity: _propTypes2.default.number,
	zIndex: _propTypes2.default.number
};

exports.default = ReactTween;
"use strict";

//import ReactTween from './ReactTween';

module.exports = {
	ReactTween: ReactTween
};
