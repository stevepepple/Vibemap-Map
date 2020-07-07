import React, { Component } from 'react'
import isEqual from 'react-fast-compare'

// MOve query string and 
import queryString from 'query-string'
import * as Constants from '../../constants.js'

import LocationSearchInput from '../map/search'
import TopVibes from '../elements/topVibes'

import { Translation } from 'react-i18next'

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
            vibe_options : [],
            selected_activity: Constants.main_categories[0],
            signature_vibes: [],
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

        console.log('Browser history: ', params)

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
        
        if (params.activity) this.lookUpActivity(params.activity)

        if (params.vibes) {
            let vibes = []
            if (typeof(params.vibes) == "string") {
                vibes.push(params.vibes)
            } else {
                vibes = params.vibes
            }

            this.setState({ vibes: vibes })
            this.props.setCurrentVibes(vibes)
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

        if (!isEqual(prevProps.currentVibes, this.props.currentVibes)) {
            this.setState({ vibes: this.props.currentVibes })
            this.props.setCurrentVibes(this.props.currentVibes)
            this.updateURL("vibes", this.props.currentVibes)
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

        // TODO: Handle route and push param here
        // How does this work for SSR
        // store.dispatch(push({ search: string }))

        const { history } = this.props

        if (history) history.push({ search: string })

    }        
    
    // Event Handlers
    handleActivityChange = (event, { value }) => {
        this.lookUpActivity(value)
    }
    
    // Use for events change and prop to state
    lookUpActivity = (value) => {
        const all_categories = Constants.activty_categories.concat(Constants.main_categories)

        let selected_activity = all_categories.find(({ key }) => key === value)

        if (selected_activity === undefined) selected_activity = Constants.main_categories[0]

        this.setState({ current_activity: value, selected_activity: selected_activity })
        this.props.setActivity(value)        

    }

    handlePlaceType = (e, { value }) => {
        console.log("CHANGED PLACE TYPE: ", value)
        this.props.setPlaceType(value)
    }

    handleSignatureVibe = (e, {value}) => {

        // Handled cleareable state
        if (value === '' || value === '') {
            this.props.setMainVibe(null)
            this.props.setCurrentVibes([])
        }
        
        let vibes = [] 

        if (value && value !== '') {
            const current = this.props.signatureVibes.find(({ key }) => key === value);

            this.props.setMainVibe(value)

            if (current !== undefined || current !== null) vibes = current.vibes

            this.setState({ vibes: vibes })
            this.props.setCurrentVibes(vibes)
        }    
    }

    handleVibeChange = (event, { value }) => {
        this.setState({ vibes: value })
        this.props.setCurrentVibes(value)
    }

    render() {
        
        const { activity, isMobile, mainVibe, signatureVibes, placeType } = this.props

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
                                <Translation>{
                                    (t, { i18n }) => <Dropdown
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
                                }</Translation>
                            </Menu.Item>
                            <Menu.Item style={{ width: '16em' }}>
                                <Form.Group widths='equal'>                        
                                    <Translation>{
                                        (t, { i18n }) => <Dropdown
                                            //button
                                            className='icon basic small'
                                            clearable
                                            //icon={this.state.selected_activity.label.icon}
                                            //labeled
                                            style={{ lineHeight: '2.4em', marginLeft: '0.4em' }}                                                                                                                                                                                
                                            //placeholder={t('Activities')}
                                            onChange={this.handleActivityChange}
                                            //options={Constants.main_categories}                                    
                                            text={this.state.selected_activity.text}
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

                                        }</Translation>

                                </Form.Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Translation>{
                                    (t, { i18n }) => <Dropdown
                                        className={'main_vibe ' + mainVibe}
                                        clearable
                                        floating
                                        //search
                                        labeled
                                        placeholder={t('Vibe sets')}
                                        onChange={this.handleSignatureVibe}
                                        options={signatureVibes}
                                        style={{ width: '12em'}}
                                        value={mainVibe}
                                    />
                                }</Translation>
                            </Menu.Item>
                            <Menu.Item>
                                {/* TODO: replace location input with search able dropdown */}
                                {/* TODO: for some reason the dropdown as a problem with prop changes. */}
                                
                            </Menu.Item>
                            <Menu.Item position='right'>
                                <TopVibes />
                            </Menu.Item>
                        </Menu>
                    </div >
                )}

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        activity: state.activity,
        allVibes: state.allVibes,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        nearby_places: state.nearby_places,
        currentLocation: state.currentLocation,
        zoom: state.zoom,
        currentDistance: state.currentDistance,
        currentVibes: state.currentVibes,
        //pathname: state.router.location.pathname,
        placeType: state.placeType,
        //search: state.router.location.search,
        searchTerm: state.searchTerm,
        mainVibe: state.mainVibe,
        signatureVibes: state.signatureVibes
    }
}

const navWithRouter = withRouter(Navigation)

export default connect(mapStateToProps, actions)(navWithRouter)