import React from 'react'
import PropTypes from 'prop-types'

export default class Tooltip extends React.Component {

    static propTypes = {
        features: PropTypes.array.isRequired
    };

    render() {
        const { features } = this.props;

        // TODO: pass array of the propoerties that shoudl be included in the tooltip
        const renderFeature = (feature, i) => {
            return (
                <div key={i}>
                    <span className='color-gray-light'>{feature.properties['type1']}</span>
                    <span className='color-gray-light'>{feature.properties['type2']}</span>
                </div>
            )
        };

        return (
            <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
                <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round txt-s w240 clip txt-truncate">
                    {features.map(renderFeature)}
                </div>
                <span className="flex-child color-gray-dark triangle triangle--d"></span>
            </div>
        );
    }
}