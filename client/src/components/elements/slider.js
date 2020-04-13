import React from 'react';
import PropTypes from 'prop-types';
import ReactSlider from 'react-slider'

import styles from "./slider.css";

const Slider = props => {
    const { min, max, step, defaultValue } = props

    return (
        <ReactSlider
            className={styles.slider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            onBeforeChange={val => console.log('onBeforeChange value:', val)}
            onChange={val => props.onChange(val)}
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            renderThumb={(props, state) => <div {...props}>{props.value}</div>}
        />
    )
}

Slider.defaultProps = {
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 0
}

export default Slider;