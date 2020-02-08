import React, { Component } from 'react'
import { Grid, Dropdown, Form } from 'semantic-ui-react'
import isEqual from 'react-fast-compare'

// MOve query string and 
import helpers from '../../helpers.js'
import queryString from 'query-string'

import LocationSearchInput from '../map/search'

import { Translation } from 'react-i18next'

import { connect } from 'react-redux'
import { store } from '../../redux/store'
import * as actions from '../../redux/actions'
import { push } from 'connected-react-router'

import TopVibes from '../elements/topVibes'

import '../../styles/navigation.scss'

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

        console.log("CURRENT PROPS in Nav", this.props)

        if (params.place) {
            this.props.setDetailsId(params.place)
            if(params.type) {
                this.props.setDetailsType(params.type)
            }
            
            // TODO: Also need to know the type
            this.props.setDetailsShown(true)
            this.props.setZoom(this.props.zoom + 2)
        }

        if (params.activity) {
            this.props.setActivity(params.activity)
        }

        // TODO: Set days from params?
        if (params.search) {
            this.props.setSearchTerm(params.search)
        }

        if (params.latitude && params.longitude) {
            this.props.setCurrentLocation({ latitude: params.latitude, longitude: params.longitude, distance_changed: 0 })
        }

        if (params.zoom) {
            this.props.setZoom(parseFloat(params.zoom))
        }

        if (params.vibes) {
            
            let vibes = []
            if (typeof(params.vibes) == "string") {
                vibes.push(params.vibes)
            } else {
                vibes = params.vibes
            }            
            this.props.setCurrentVibes(vibes)
        }

        if (params.days) {
            this.props.setDays(params.days)
        }
    }

    // Sync URL params with React Router history in Redux store
    componentDidUpdate(prevProps, prevState) {    
                
        let new_history = queryString.stringify(this.state.params)    
        push(new_history)

        if (!isEqual(prevProps.searchTerm, this.props.searchTerm)) {            
            helpers.updateURL("search", this.props.searchTerm)
        }

        if (!isEqual(prevProps.currentLocation.latitude, this.props.currentLocation.latitude)) {         
            this.updateURL("latitude", this.props.currentLocation.latitude)
            this.updateURL("longitude", this.props.currentLocation.longitude)
        }

        if (!isEqual(prevProps.detailsId, this.props.detailsId)) {
            this.updateURL("place", this.props.detailsId)
        }

        if (!isEqual(prevProps.detailsType, this.props.detailsType)) {
            this.updateURL("type", this.props.detailsType)
        }

        if (!isEqual(prevProps.zoom, this.props.zoom)) {
            this.updateURL("zoom", this.props.zoom)
        }

        if (!isEqual(prevProps.activity, this.props.activity)) {     
            this.updateURL("activity", this.props.activity)
        }

        if (!isEqual(prevProps.currentVibes, this.props.currentVibes)) {            
            //this.setState({ vibes: this.props.currentVibes })
            this.props.setCurrentVibes(this.props.currentVibes)
        }

        if (!isEqual(prevProps.searchTerm, this.props.searchTerm)) {                        
            this.updateURL("search", this.props.searchTerm)
        }
    }

    updateURL(key, value) {
        // Update state and push to Redux search history
        let params = this.state.params;

        if (value && value !== "") {
            params[key] = value    
        } else {
            delete params[key]
        }
        
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

    handleVibeChange = (event, { value }) => {
        this.setState({ vibes: value })        
        this.props.setCurrentVibes(value)  
    }

    render() {

        let search = <Form size='small'>
            <Form.Group>
                <LocationSearchInput className='mobile search'/>
                {/* TODO: Further investigate why dropdowns are the slowest component on the page */}
                <Translation>{
                (t, { i18n }) => <Dropdown
                    className='icon left tiny datepicker'
                    button
                    labeled
                    icon='calendar'
                    onChange={this.handleDaysChange}
                    text={t(this.state.options.find(obj => obj.value === this.props.currentDays).text)}
                    >
                    <Dropdown.Menu>
                        {this.state.options.map((option) => (
                            <Dropdown.Item key={option.value} text={t(option.text)} value={option.value} />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                }</Translation>
            </Form.Group>
        </Form>

        return (
            <React.Fragment>
                {this.props.isMobile? (
                    <div className='navigation mobile'>
                        {search}
                    </div>

                ) : (
                    
                    <div className='navigation'>                    
                        <Grid stackable stretched verticalAlign='middle'>
                            <Grid.Column width={5}>
                                {search}
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <TopVibes />
                            </Grid.Column>
                            <Grid.Column width={6}>
                                {/* TODO: replace location input with search able dropdown */}
                                {/* TODO: for some reason the dropdown as a problem with prop changes. */}
                                <Translation>{
                                    (t, { i18n }) => <Dropdown
                                        placeholder={t("What's your vibe")}
                                        multiple
                                        label="Vibe"
                                        search
                                        selection
                                        closeOnChange
                                        onChange={this.handleVibeChange}
                                        options={this.state.vibe_options}
                                        value={this.props.currentVibes}
                                    />
                                }</Translation>

                                
                            </Grid.Column>
                        </Grid>                        
                    </div >
                )}

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        activity: state.activity,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        nearby_places: state.nearby_places,
        currentLocation: state.currentLocation,
        zoom: state.zoom,
        currentDays: state.currentDays,
        currentDistance: state.currentDistance,
        currentVibes: state.currentVibes,
        pathname: state.router.location.pathname,
        search: state.router.location.search,
        searchTerm: state.searchTerm
    }
}

export default connect(mapStateToProps, actions)(Navigation)