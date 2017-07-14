#react-tween-to

A simple react Higher Order Component that is smart enough to do some easy animation for you.

###How to use it
```javascript

import { ReactTween } from 'react-tween-to';

const SimpleComponent = ({ tweenStyles }) => {
	return (
		<div className='tween' style={{...tweenStyles}}>Tween Me!!!!</div>
	);
};

const SimpleComponentTween = ReactTween(SimpleComponent);

const ParentComponent = () => {
	const tweenProps = {
		timing : 500,
		easing : 'easeOut',
		opacity : 1,
		width : '100px',
		height : '100px'
	};

	return (
		<div className='parent'>
			<SimpleComponentTween {...tweenProps} />
		</div>
	);
};
```

The Tween component calculates any changes to the props after the componentDidMount and render a new animation based on the new props that get past to it.

Available props are:

* timing: PropTypes.number => milliseconds of the tween animations
* easing: PropTypes.string => Options are; simple, easeIn, and easeOut
* left: PropTypes.string => CSS value. You can use px, em, rem, or %
* right: PropTypes.string => CSS value. You can use px, em, rem, or %
* top: PropTypes.string => CSS value. You can use px, em, rem, or %
* bottom: PropTypes.string => CSS value. You can use px, em, rem, or %
* width: PropTypes.string => CSS value. You can use px, em, rem, vw, or %
* height: PropTypes.string => CSS value. You can use px, em, rem, vh, or %
* fontSize: PropTypes.string => CSS value. You can use px, em, or rem
* opacity: PropTypes.number => CSS value from 0-1

Important Note! Once you use a certain measurement unit for a property, keep it. If you use 3px at first and want to go to 1rem, the calculation will break. Use 3px => 16px instead.

Have Fun!
