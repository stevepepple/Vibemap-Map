// @flow 
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import isEqual from 'react-fast-compare'

import { Translation } from 'react-i18next'
import { Dropdown } from 'semantic-ui-react'

class AllVibes extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            vibe_options : [],
            vibes: []
        }
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.allVibes, this.props.allVibes)) {
                        
            let vibe_options = this.props.allVibes.map(function (vibe) {
                return { key: vibe, value: vibe, className: 'vibe', text: vibe }
            })

            console.log('Vibe options: ', vibe_options)

            this.setState({ vibe_options : vibe_options})
        }
        
        if (!isEqual(prevProps.vibes, this.props.vibes)) {

            this.setState({ vibes: this.props.vibes })
        }
    }    

    handleVibeChange = (event, { value }) => {
    
        // Make strings array
        if (value === 'string') value = [value]
        console.log('Vibe changed: ',)

        this.setState({ vibes: value })
        this.props.setVibes(value)
    }

    clearVibes = () => {
        this.setState({ vibes : [] })
    }

    renderVibesLabel = (label) => ({        
        className: label.text,
        content: label.text,
    })

    render() {
        let num_vibes = this.state.vibes.length

        return (
            <div className='allVibes' style={{ position: 'absolute', margin: '1em', zIndex: '90'}}>
                {num_vibes > 0 &&
                    <Fragment>                        
                        <Translation>{
                            (t, { i18n }) => <Dropdown
                                style={{ minWidth: '12em' }}
                                placeholder={t("Add more vibes")}
                                //multiple
                                icon='add'
                                label="Vibe"
                                labeled
                                clearable
                                multiple
                                search
                                closeOnChange
                                onChange={this.handleVibeChange}
                                options={this.state.vibe_options}
                                value={this.props.vibes}
                                renderLabel={this.renderVibesLabel}
                            />
                        }</Translation>
                        {/* 
                        <Button className='icon tiny'
                            onClick={this.clearVibes}>
                            <Icon name='remove' />
                        </Button>
                        */}
                    </Fragment>
                }

                {num_vibes === 0 &&
                    <Translation>{
                        (t, { i18n }) => <Dropdown
                        button
                        className='icon basic'
                        icon='add'
                        labeled
                        multiple
                        search
                        onChange={this.handleVibeChange}
                        value={this.props.vibes}
                        options={this.state.vibe_options}                        
                        style={{ minWidth: '12em' }}
                        label='Add Vibe'
                    />
                    }</Translation>
                }
                
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    //console.log('store to weather: ', state)
    return {
        allVibes: state.nav.allVibes,
        vibes: state.nav.vibes,
        topVibes: state.topVibes
    }
}

export default connect(mapStateToProps, actions)(AllVibes)