// @flow 
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import isEqual from 'react-fast-compare'

import { Translation } from 'react-i18next'
import { Button, Dropdown, Icon, Label } from 'semantic-ui-react'
import * as style_variables from 'vibemap-constants/design-system/build/json/variables.json';


class AllVibes extends Component {    
    constructor(props, context) {
        super(props, context)
        this.state = {
            vibe_options : [],
            vibes: []
        }
    }

    componentWillMount() {
        const { allVibes, vibes } = this.props
        this.setOptions(allVibes)
    }

    componentDidUpdate(prevProps) {

        if (!isEqual(prevProps.allVibes, this.props.allVibes)) {
            this.setOptions(this.props.allVibes)
        }
        
        if (!isEqual(prevProps.vibes, this.props.vibes)) {

            this.setState({ vibes: this.props.vibes })
        }
    }  
    
    setOptions(allVibes) {
        const has_vibes = allVibes && allVibes.length > 0
        
        if (has_vibes) {
            let vibe_options = allVibes.map(function (vibe) {
                return { key: vibe, value: vibe, className: 'vibe', text: vibe }
            })

            this.setState({ vibe_options: vibe_options })
        }

    }

    handleVibeChange = (event, { value }) => {
    
        // Make strings array
        if (value === 'string') value = [value]
        console.log('Vibe changed: ', value, typeof(value))

        this.props.setVibes(value)
        this.setState({ vibes: value })
        // Minor hack to trigger change
        this.props.setLayersChanged(true)

    }

    addVibe = (event, { value }) => {
        let { vibes, setVibes } = this.props 
        // Make strings array
        let new_vibes = vibes
        new_vibes = vibes.concat(value)
        
        console.log('addVibe: ', value, setVibes)

        setVibes(new_vibes)
        this.setState({ vibes: new_vibes })
    }

    removeVibe = (value) => {
        const { vibes } = this.props
        // Make strings array
        let new_vibes = vibes
        let foundIndex = new_vibes.indexOf(value)
        if (foundIndex > -1) new_vibes.splice(foundIndex, 1)
        console.log('Remove vibe: ', value, vibes)
        this.props.setVibes(new_vibes)
        this.setState({ vibes: new_vibes })

    }

    clearVibes = () => {
        const empty_vibes = []
        this.props.setVibes(empty_vibes)
        this.setState({ vibes: empty_vibes })
    }

    renderVibesLabel = (label) => ({        
        className: label.text,
        content: label.text,
    })

    render() {
        const { allVibes, vibes } = this.props
        const { vibe_options } = this.state

        let num_vibes = vibes.length

        let white = style_variables.color.base.white

        const vibeItems = vibes.map((vibe) => {
            return <Label key={vibe} className='vibe' style={{ background: white }} size='large'>
                {vibe}
                <Icon name='delete' onClick={this.removeVibe.bind(this, vibe)} />
            </Label>
        })

        return (
            <div className='allVibes' style={{ position: 'absolute', margin: '0.2em', zIndex: '90'}}>
                <Dropdown
                    button
                    className='icon'
                    icon='add'
                    labeled
                    basic
                    options={vibe_options}
                    onChange={this.addVibe}
                    search
                    style={{ background: white, borderRadius: '10em'}}
                    text='Add vibe' />

                {num_vibes > 0 &&
                    <Fragment>
                        {vibeItems}

                        <Button basic circular className='icon' style={{ background: white }}
                            onClick={this.clearVibes}>
                            <Icon name='remove' />
                        </Button>
                    </Fragment>
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