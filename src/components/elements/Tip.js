import React from "react"

import { Card } from "semantic-ui-react"
import ShowMoreText from 'react-show-more-text'

import styles from "./Tip.module.scss";

export default class Tip extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: props.index
        }
    }

    render() {
        const { numLines, text } = this.props 

        return (
            <div className={styles.tip}>
                <ShowMoreText
                    /* Default options */
                    lines={numLines}
                    more='Show more'
                    less='Show less'
                    anchorClass=''
                    onClick={this.executeOnClick}
                    expanded={false}>
                    {text}
                </ShowMoreText>
            </div>
        )
    }
}

Tip.defaultProps = {
    numLines: 6,
    text: 'Opening in 1898, The Marketplace provides a distinctive space for bringing together the greater Bay Area\'s agricultural wealth and renowned specialty food purveyors under one roof.'
}