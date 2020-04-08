// @flow 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import isEqual from 'react-fast-compare'

import { Translation } from 'react-i18next'
import { Dropdown } from 'semantic-ui-react'

class AllVibes extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            vibe_options : []
        }
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.allVibes, this.props.allVibes)) {
            
            let vibe_options = this.props.allVibes.map(function (vibe) {
                return { key: vibe, value: vibe, className: 'vibe', text: vibe }
            })

            this.setState({ vibe_options : vibe_options})
        }        
    }    

    handleVibeChange = (event, { value }) => {
        this.setState({ vibes: value })
        this.props.setCurrentVibes(value)
    }

    render() {

        return (
            <div className='allVibes' style={{ position: 'absolute', margin: '1em', zIndex: '90'}}>
                <Translation>{
                    (t, { i18n }) => <Dropdown
                        style={{ minWidth: '12em' }}
                        clearable
                        placeholder={t("Add more vibes")}
                        multiple
                        label="Vibe"
                        search
                        closeOnChange
                        onChange={this.handleVibeChange}
                        options={this.state.vibe_options}
                        value={this.props.currentVibes}
                        renderLabel={this.renderVibesLabel}
                    />
                }</Translation>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    //console.log('store to weather: ', state)
    return {
        allVibes: state.allVibes,
        currentVibes: state.currentVibes,
        topVibes: state.topVibes
    }
}

export default connect(mapStateToProps, actions)(AllVibes)