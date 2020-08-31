import React from 'react';
import isEqual from 'react-fast-compare'

import { Dropdown } from 'semantic-ui-react'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { withTranslation } from 'react-i18next';

import helpers from '../../helpers.js'

import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            address: '',
            best: null, 
            results : [],
            featured: ['Chicago, IL', 'Denver, CO', 'Guadalajara, MX', 'Los Angeles', 'New York, NY', 'Oakland, CA', 'Portland, OR', 'San Francisco, CA', 'Seattle, WA', 'Vancouver, CA'],
            // TODO: update Admin pannel with this value and pull from API
            nearest: '',
            locations: []
        }

        this.handleSearch = this.handleSearch.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }

    componentWillMount() {     
        const { allCities, currentLocation } = this.props
        if (allCities.length > 0) this.handleCities()
        if (currentLocation.latitude && currentLocation.longitude) this.setNearest()   
    }

    componentDidUpdate(prevProps, prevState) {
        const { allCities, currentLocation } = this.props
        
        // Handle city or locations changes
        if (allCities.length > 0 && !isEqual(prevProps.allCities, allCities)) this.handleCities()
        if (prevProps.currentLocation.latitude !== currentLocation.latitude) this.setNearest()
    }

    setNearest() {
        if (this.state.locations.length > 0) {
            let ordered_locations = helpers.sortLocations(this.state.locations, this.props.currentLocation)
            let distance_from_user = helpers.getDistance([this.props.currentLocation.longitude, this.props.currentLocation.latitude], ordered_locations[0].centerpoint)

            // If user is with 20 miles of city, set that as the city
            if (distance_from_user < 20) this.setState({ nearest: ordered_locations[0]['id'] })
        }
    }

    handleCities() {
        
        let locations = this.props.allCities.map(function (item) {            
            // Attributes for dropdown
            item['key'] = item['id']
            item['value'] = item['id']
            item['text'] = item['name']
            delete item['description']

            return item
        })        
        
        // Filter all cities to only the list of feature cities. 
        const featured = this.state.featured
        const filtered = locations.filter(function (el) { return featured.indexOf(el.name) >= 0; });

        // Sort by location to user
        let ordered_locations = helpers.sortLocations(filtered, this.props.currentLocation)
        let distance_from_user = helpers.getDistance([this.props.currentLocation.longitude, this.props.currentLocation.latitude], ordered_locations[0].centerpoint)
        if(distance_from_user < 20) this.setState({ nearest: ordered_locations[0]['id'] })
        
        this.setState({ locations: ordered_locations })
    }

    handleSearch = (e, { searchQuery }) => {

        // Auto search once two letter are typed
        if(searchQuery.length > 1) {

            this.setState({ address: searchQuery }, function(){

                // TODO: there an extra call on this step that should be simplified
                geocodeByAddress(this.state.address)
                    .then(results => {

                        // TODO: This is probably not the right way to do this
                        let new_locations = results.map(address => {
                            if (address.formatted_address) {
                                return { key: address.place_id, id: address.place_id, text: address.formatted_address, centerpoint: [address.geometry.location.lat(), address.geometry.location.lng()], value: address.formatted_address }
                            } else {
                                return null
                            }
                        })

                        if (new_locations.length > 0) {
                            this.props.setCurrentLocation({ latitude: new_locations[0].centerpoint[0], longitude: new_locations[0].centerpoint[1] })
                            this.setState({
                                results: new_locations
                            })
                        }
                        

                    })
            });    
        }   
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = (e, { value }) => {
        
        let item = this.state.locations.find(o => o.value === value)

        // User picked an item from the list
        if (typeof item == 'object') {
            // Set zoom & bearing
            this.props.setCurrentLocation({ latitude: item.centerpoint[1], longitude: item.centerpoint[0] })
            if (item.zoom_start) this.props.setZoom(item.zoom_start)
            if (item.bearing_start) this.props.setBearing(item.bearing_start)

            this.props.clearDetails(false)
        } else {
            geocodeByAddress(value)
                .then(results => {

                    this.setState({ results: results })

                    getLatLng(results[0])
                        .then(best => this.setState({ best: best }))

                })
                .then(best => {
                    //this.props.setPosition(this.state.best.lat, this.state.best.lng)
                    console.log('Best result: ', best)
                    this.props.setCurrentLocation({ latitude: this.state.best.lat, longitude: this.state.best.lng })
                })
                .catch(error => console.error('Error', error));
        }
    }

    render() {

        const { t } = this.props;
        const { locations, results } = this.state;

        // TODO: Set this from the backend via prop
        // Or another preferred mechanism
        //i18n.changeLanguage('es');
        //console.log('Got i18n translations: ', t)

        // TODO: How to add a divider between new results and other cities
        // TODO: load list from the API and store in Redux
        let options = locations.concat(results)

        return (
            <Dropdown
                fluid
                search
                className='icon select_city'
                labeled
                compact                
                floating                     
                onSearchChange={this.handleSearch}
                onChange={this.handleSelect}
                options={options}
                value={this.state.nearest}
                placeholder={t('Near you')}
                style={{ width : '12em', marginLeft: '0.6em', zIndex: '100', marginRight: '4rem' }}
            />
        );
    }
}

const mapStateToProps = state => ({
    bearing: state.map.bearing,
    allCities: state.nav.allCities,  
    currentLocation: state.nav.currentLocation,
    zoom: state.map.zoom
});

// withNamespaces
export default connect(mapStateToProps, actions)(withTranslation()(LocationSearchInput))