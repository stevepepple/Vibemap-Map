import React, { Component } from 'react'
import { Grid, Dropdown, Form } from 'semantic-ui-react'
import queryString from 'query-string'

import PropTypes from 'prop-types'
import * as Constants from '../../constants.js'

import LocationSearchInput from '../map/search'

import { connect } from 'react-redux'
import { store } from '../..//redux/store'

import * as actions from '../../redux/actions'
import { push } from 'connected-react-router'

import '../../styles/navigation.scss'


const datePicker = {
    minWidth: '140px',
    lineHeight: '2em'
}

class Navigation extends Component {
    constructor(props) {
        super(props)

        this.state = {
            options: [
                { key: '1', text: 'Today', value: '1' },
                { key: '2', text: '2 days', value: '2' },
                { key: '3', text: '3 days', value: '3' },
                { key: '7', text: 'Week', value: '5' },
                { key: '14', text: '2 weeks', value: '14' }
            ],
            params: {},
            vibes: [],
            vibe_options : []
        }
    }

    componentWillMount() {
        this.setVibeOptions()        

        let params = queryString.parse(this.props.search)
        this.setState({ params: params })

        if (params.activity) {
            this.props.setActivity(params.activity)
        }

        if (params.days) {
            this.props.setDays(params.days)
        }

        if (params.vibes) {
            this.props.setCurrentVibes(params.vibes)
            console.log("Vibes from URL: ", params.vibes)
        }
    }

    // TODO: Should this be in Redux
    componentWillReceiveProps(props) {
        let new_history = queryString.stringify(this.state.params)
        console.log("Navigation got new props: ", new_history)
        push(new_history);
    }

    updateURL(key, value) {
        // Update state and push to Redux search history
        let params = this.state.params;
        params[key] = value
        let string = queryString.stringify(params)
        store.dispatch(push({ search: string }))
    }

    setVibeOptions = (props) => {
        let options = this.props.vibes.map(function (vibe) {
            return { key: vibe, value: vibe, text: vibe }
        })
  
        this.setState({ vibe_options: options })
        // Update redux with the default value
        this.props.setCurrentVibes(this.state.vibes)
    }
    
    handleDaysChange = (e, { value }) => {
        this.props.setDays(value)
        this.updateURL("days", value)
    }

    handleActivityChange = (event, { value }) => {
        this.setState({ current_activity : value })
        this.props.setActivity(value)
        this.updateURL("activity", value)
    }

    handleVibeChange = (event, { value }) => {
        this.setState({ vibes: value })
        this.props.setCurrentVibes(value)  
        this.updateURL("vibes", value)
    }

    render() {

        let search = <Form>
            <Form.Group widths='equal'>
                <LocationSearchInput className='mobile search'/>
                <Dropdown
                    button
                    className='icon'
                    compact
                    icon='calendar'
                    labeled
                    onChange={this.handleDaysChange}
                    options={this.state.options}
                    text={this.state.options.find(obj => obj.value == this.props.currentDays).text}
                    style={datePicker}
                />
            </Form.Group>
        </Form>

        return (
            <div>
                {this.props.isMobile? (
                    <div className='navigation mobile'>
                        {search}
                    </div>

                ) : (
                    
                    <div className='navigation'>
                            <Grid stackable stretched verticalAlign='middle'>
                            <Grid.Column width={7}>
                                {search}
                            </Grid.Column>
                            <Grid.Column width={9}>
                                {/* TODO: replace location input with search able dropdown */}
                                <Form><Form.Group>
                                    <Dropdown
                                        placeholder='Activity'
                                        search
                                        className='icon'                                    
                                        icon='bullseye' // TODO: Map currently selected to icon
                                        selection
                                        onChange={this.handleActivityChange}
                                        options={Constants.activty_categories}
                                        value={this.props.activity}
                                    />

                                    <Dropdown
                                        placeholder="What&#39;s your vibe?"
                                        fluid
                                        multiple                                
                                        compact
                                        label="Vibe"
                                        search
                                        selection
                                        onChange={this.handleVibeChange}
                                        //value={['local']}
                                        options={this.state.vibe_options}
                                        value={this.props.currentVibes}
                                    />
                                </Form.Group></Form>                                

                            </Grid.Column>
                        </Grid>
                    </div >
                )}

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        activity: state.activity,
        nearby_places: state.nearby_places,
        currentLocation: state.currentLocation,
        currentZoom: state.currentZoom,
        currentDays: state.currentDays,
        currentDistance: state.currentDistance,
        currentVibes: state.currentVibes,
        pathname: state.router.location.pathname,
        search: state.router.location.search
    }
}

export default connect(mapStateToProps, actions)(Navigation)