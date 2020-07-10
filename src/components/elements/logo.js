import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'


class Logo extends Component {
    render() {
        const { spinning, size } = this.props
        const style = {
            height: size + 'px',
            position: 'absolute', 
            marginBottom: size / 2,
            marginRight: size / 2,
            top: '50%', 
            left: '50%', 
            width: size + 'px',
            zIndex: 100
        }

        return (
            <div className="logo" style={style}>
                <img width={size} src="/images/logo-mark.svg" alt="Vibemap" />
            </div>
        );
    }
}

// TODO: Add default props
Logo.defaultProps = {
    spinning: true,
    size: 140
}

export default Logo;