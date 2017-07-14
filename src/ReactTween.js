import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const printMs = () => {
	var d = new Date();
	var n = d.getMilliseconds();
	var s = d.getSeconds();
	//console.log('time -- ' + s + '.' + n);
};

const ReactTween = (WrappedComponent) => {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.msPs = 16.7; //60fps
			this.requestFrameRef = false;
			this.tweenPath = { }
			this.tweenIterations = 0;

			this.animationKeys = ['top', 'left', 'bottom', 'right', 'height', 'width', 'opacity', 'fontSize', 'zIndex'];

			this.state = {
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
		}

		componentDidMount() {}

		componentWillReceiveProps(nextProps) {
			printMs()
			//console.log('current', this.props);
			//console.log('next', nextProps);
			const timing = nextProps.timing || this.state.timing;
			const iterations = Math.round(timing/this.msPs);

			let currentStyles = _.omitBy(this.state, _.isUndefined);
			currentStyles = _.pick(currentStyles, this.animationKeys);

			const paths = _.map(currentStyles, (data, key) => {
				const json = {};

				const unitType = this.getUnitType(String(data));

				const oldValue = String(data).replace(unitType, '');
				const newValue = String(nextProps[key]).replace(unitType, '');
				
				let stylePath = [newValue+unitType];

				if (iterations > 0) {
					stylePath = _.times(iterations, (i) => {
						//the i + 1 makes sure that you get to the end value
						const nextValue = this.getCalculatedValue(i+1, oldValue, newValue, iterations);

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

			const currentFrame = this.getCurrentFrameState();
			
			//console.log(nextProps.timing);
			//console.log('FIRST', currentFrame, iterations, this.tweenPath, nextProps);

			//console.log('------');
			this.state = {...nextProps, ...currentFrame, frame: 0};
			//setTimeout(() => {
				//this.setState({...nextProps, ...currentFrame, frame: 0});
			//}, 0);
		}

		componentDidUpdate() {
			if (this.state.frame < this.tweenIterations && !this.props.isPaused) {
				const currentFrame = this.getCurrentFrameState();

				this.requestFrameRef = window.requestAnimationFrame(this.loop.bind(this, currentFrame));
				
				//setTimeout(this.loop.bind(this), this.msPs);
			} else if(this.props.onComplete && this.state.frame == this.tweenIterations) {
				console.log(this.state.frame + ' ---- complete -----');
				printMs();
				this.props.onComplete();
			}
			
		}

		componentWillUnmount() {
			window.cancelAnimationFrame(this.requestFrameRef);
		}

		loop(currentFrame) {
			this.setState({...this.state, ...currentFrame});

			if (this.props.onUpdate) {
				this.props.onUpdate(this.state);
			}
		}

		getUnitType(value) {
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

		getCalculatedValue(frame, oldValue, newValue, iterations) {
			switch (this.state.easing) {
				case 'easeIn':
					return oldValue - (oldValue-newValue)*(Math.pow((frame), 4)/Math.pow(iterations, 4));
				case 'easeOut':
					return oldValue - (oldValue-newValue)*(1 - Math.pow((iterations-(frame)), 4)/Math.pow(iterations, 4));
				default:
					return oldValue - (oldValue-newValue)*((frame)/iterations);
			}
		}

		getCurrentFrameState() {
			const frameState = {};
			_.map(this.tweenPath, (data) => {
				frameState[data.key] = data.path[this.state.frame];
			});

			frameState['frame'] = this.state.frame + 1;
			return frameState;
		}

		render() {
			let styles = _.omitBy(this.state, _.isUndefined);
			styles = _.pick(styles, this.animationKeys);

			return <WrappedComponent {...this.props} tweenStyles={styles} />;
		}
	};
}

ReactTween.defaultProps = {
	timing: 500,
	easing: 'simple'
};

ReactTween.propTypes = {
	timing: PropTypes.number.isRequired,
	easing: PropTypes.string.isRequired,
	top: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	left: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	bottom: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	right: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	fontSize: PropTypes.string,
	height: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	width: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	opacity: PropTypes.number,
	zIndex: PropTypes.number
}

export default ReactTween;
