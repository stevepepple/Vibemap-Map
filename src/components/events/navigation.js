import React, { Component } from 'react'
import isEqual from 'react-fast-compare'
import update from 'react-addons-update';

// MOve query string and 
import queryString from 'query-string'
import * as Constants from '../../constants.js'

import LocationSearchInput from '../map/search'

import { Translation } from 'react-i18next'
import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { withRouter } from 'react-router-dom';

import { Dropdown, Form, Menu } from 'semantic-ui-react'

import '../../styles/navigation.scss'
//import vibe_styles from '../../styles/vibes.scss'
class Navigation extends Component {

    constructor(props) {
        super(props)

        this.state = {            
            place_type_options: [
                { key: 'both', value: 'both', text: 'Everything' },
                { key: 'places', value: 'places', text: 'Places' },
                { key: 'events', value: 'events', text: 'Events' },
                { key: 'guides', value: 'guides', text: 'Guides' }
            ],
            params: {},
            vibes: [],
            vibe_options : []
        }

        this.navRef = React.createRef()
    }

    componentDidMount() {
        this.props.setHeaderSize({
            height: this.navRef.current.offsetHeight,
            width: this.navRef.current.offsetWidth
        })

    }

    componentWillMount() {
        const { history } = this.props
        
        let params = queryString.parse(history.location.search, { ignoreQueryPrefix: true })

        this.setState({ params: params })

        // TODO: Move to Details page
        if (params.place) {
            this.props.setDetailsId(params.place)
            if(params.type) {
                this.props.setDetailsType(params.type)
            }
            
            // TODO: Also need to know the type
            this.props.setDetailsShown(true)
            this.props.setZoom(this.props.zoom + 2)
        }

        // Set Redux state from Router params
        if (params.latitude && params.longitude) this.props.setCurrentLocation({ latitude: params.latitude, longitude: params.longitude, distance_changed: 0 })
        if (params.mainVibe) this.props.setMainVibe(params.mainVibe)
        if (params.days) this.props.setDays(params.days)
        //if (params.place_type) this.props.setPlaceType(params.place_type)                    
        if (params.search) this.props.setSearchTerm(params.search)

        if (params.zoom) this.props.setZoom(parseFloat(params.zoom))
        
        if (params.vibes) {
            let vibes = []
            if (typeof(params.vibes) == "string") {
                vibes.push(params.vibes)
            } else {
                vibes = params.vibes
            }

            this.setState({ vibes: vibes })
            this.props.setVibes(vibes)
        }
    }

    // Sync URL params with React Router history in Redux store
    componentDidUpdate(prevProps, prevState) {
                        
        if (!isEqual(prevProps.activity, this.props.activity)) this.updateURL("activity", this.props.activity)
        if (!isEqual(prevProps.detailsId, this.props.detailsId)) this.updateURL("place", this.props.detailsId)
        if (!isEqual(prevProps.detailsType, this.props.detailsType)) this.updateURL("type", this.props.detailsType)
        if (!isEqual(prevProps.mainVibe, this.props.mainVibe)) this.updateURL("mainVibe", this.props.mainVibe)
        if (!isEqual(prevProps.placeType, this.props.placeType)) this.updateURL("place_type", this.props.placeType)
        if (!isEqual(prevProps.searchTerm, this.props.searchTerm)) this.updateURL("search", this.props.searchTerm)
        if (!isEqual(prevProps.vibes, this.props.vibes)) this.updateURL("vibes", this.props.vibes)
        if (!isEqual(prevProps.zoom, this.props.zoom)) this.updateURL("zoom", this.props.zoom)        

        if (!isEqual(prevProps.currentLocation.latitude, this.props.currentLocation.latitude)) {
            this.updateURL("latitude", this.props.currentLocation.latitude)
            this.updateURL("longitude", this.props.currentLocation.longitude)
        }

        if (!isEqual(prevProps.allVibes, this.props.allVibes)) {
            
            let vibe_options = this.props.allVibes.map(function (vibe) {
                return { key: vibe, value: vibe, text: vibe }
            })            

            this.setState({ vibe_options : vibe_options})
        }

        if (!isEqual(prevProps.vibes, this.props.vibes)) {
            this.setState({ vibes: this.props.vibes })
            this.props.setVibes(this.props.vibes)
            this.updateURL("vibes", this.props.vibes)
        }
    }

    updateURL(key, value) {
        // Update state and push to Redux search history
        const { history } = this.props

        let params = this.state.params;

        if (value && value !== "") {
            params[key] = value    
        } else {
            delete params[key]
        }
        
        let string = queryString.stringify(params)

        // TODO: Handle route and push param here
        // How does this work for SSR
        // store.dispatch(push({ search: string }))

        if (history) history.push({ search: string })

    }        
    
    // Event Handlers
    handleActivityChange = (event, { value }) => {
        this.props.setActivity(value)
    }    

    handlePlaceType = (e, { value }) => {
        console.log("CHANGED PLACE TYPE: ", value)
        this.props.setPlaceType(value)
    }

    handleVibesets = (e, {value}) => {

        // Handled cleareable state
        if (value === '' || value === 'all') {
            this.props.setMainVibe(null)
            this.props.setVibes([])
        }
        
        let vibes = [] 

        if (value && value !== '' && value !== 'all') {
            const current = this.props.vibesets.find(({ key }) => key === value);

            this.props.setMainVibe(value)

            if (current !== undefined || current !== null) vibes = current.vibes

            this.setState({ vibes: vibes })
            this.props.setVibes(vibes)
        }    
    }

    handleVibeChange = (event, { value }) => {
        this.setState({ vibes: value })
        this.props.setVibes(value)
    }

    render() {
        
        const { activity, isMobile, mainVibe, vibesets, placeType, selected_activity, t } = this.props

        // TODO: Add this from server side
        // Add all options in immutable fashion
        const all = { key: "all", value: "all", text: "All vibes" }        
        const vibeset_options = update(vibesets, { $unshift: [all] });

        let search = <Form size='small'>
            <Form.Group>
                <LocationSearchInput className='mobile search'/>
                {/* TODO: Further investigate why dropdowns are the slowest component on the page */}                
            </Form.Group>
        </Form>

        return (
            <React.Fragment>
                {isMobile? (
                    <div className='navigation mobile' ref={this.navRef}>
                        {search}
                    </div>
                ) : (
                    
                    <div id='navigation' className='navigation' ref={this.navRef}>
                        <Menu fluid secondary borderless>
                            <Menu.Item>
                                <Dropdown
                                    //icon='map pin'
                                    labeled
                                    compact
                                    //className='icon basic small'
                                    style={{ width: '10em', lineHeight: '2.4em', marginLeft: '0.4em' }}
                                    text={t(placeType)}
                                    value={placeType}
                                    onChange={this.handlePlaceType}>
                                    <Dropdown.Menu>
                                        {this.state.place_type_options.map((option) => (
                                            <Dropdown.Item key={option.value} onClick={this.handlePlaceType} text={t(option.text)} value={option.value} />
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>                            
                            </Menu.Item>
                            <Menu.Item style={{ width: '16em' }}>
                                <Form.Group widths='equal'>                     
                                    <Dropdown
                                        //button
                                        className='icon basic small'
                                        clearable
                                        //icon={this.state.selected_activity.label.icon}
                                        //labeled
                                        style={{ lineHeight: '2.4em', marginLeft: '0.4em' }}                                                                                                                                                                                
                                        //placeholder={t('Activities')}
                                        onChange={this.handleActivityChange}
                                        //options={Constants.main_categories}
                                        text={t(selected_activity.text)}
                                        value={activity}>
                                        <Dropdown.Menu>
                                            {Constants.main_categories.map((option) => (
                                                <Dropdown.Item key={option.value} label={option.label} onClick={this.handleActivityChange} text={t(option.text)} value={option.value} />
                                            ))}
                                            <Dropdown.Divider />
                                            {Constants.activty_categories.map((option) => (
                                                <Dropdown.Item key={option.value} label={option.label} onClick={this.handleActivityChange} text={t(option.text)} value={option.value} />
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Dropdown
                                    className={'main_vibe ' + mainVibe}
                                    clearable
                                    floating
                                    //search
                                    labeled
                                    placeholder={t('Vibe sets')}
                                    onChange={this.handleVibesets}
                                    options={vibeset_options}
                                    style={{ width: '12em' }}
                                    value={mainVibe}
                                />
                            </Menu.Item>
                            <Menu.Item>
                                {/* TODO: replace location input with search able dropdown */}
                                {/* TODO: for some reason the dropdown as a problem with prop changes. */}
                                
                            </Menu.Item>
                            <Menu.Item position='right'></Menu.Item>
                        </Menu>
                    </div >
                )}

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        allVibes: state.nav.allVibes,
        activity: state.nav.activity,
        currentLocation: state.nav.currentLocation,
        mainVibe: state.nav.mainVibe,
        placeType: state.nav.placeType,
        searchTerm: state.nav.searchTerm,
        selected_activity: state.nav.selected_activity,
        vibes: state.nav.vibes,
        vibesets: state.nav.vibesets,

        // Map
        zoom: state.map.zoom,
        currentDistance: state.currentDistance,

        // Places
        nearby_places: state.nearby_places,
        detailsId: state.places.detailsId,
        detailsType: state.detailsType,

    }
}

const navWithRouter = withRouter(Navigation)

export default connect(mapStateToProps, actions)(withTranslation()(navWithRouter))