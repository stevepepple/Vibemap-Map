import React from 'react';
import isEqual from 'react-fast-compare'

import { Dropdown } from 'semantic-ui-react'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

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
    }

    componentDidUpdate(prevProps, prevState) {
        
        if (this.props.cities.length > 0 && !isEqual(prevProps.cities, this.props.cities)) {
            this.handleCities()
        }

        if (prevProps.currentLocation.latitude !== this.props.currentLocation.latitude) {            
            this.setNearest()
        }        
    }

    setNearest() {
        console.log('Set nearest: ', this.state.locations)

        if (this.state.locations.length > 0) {
            let ordered_locations = helpers.sortLocations(this.state.locations, this.props.currentLocation)
            let distance_from_user = helpers.getDistance([this.props.currentLocation.longitude, this.props.currentLocation.latitude], ordered_locations[0].centerpoint)

            if (distance_from_user < 20) {
                console.log('SET AS CITY: ', ordered_locations[0]['id'])
                this.setState({ nearest: ordered_locations[0]['id'] })
            }
        }

    }

    handleCities() {
        
        let locations = this.props.cities.map(function (item) {            
            //return { key: item['id'], value: item['id'], text: item['name'] }
            // Attributes for dropdown
            item['key'] = item['id']
            item['value'] = item['id']
            item['text'] = item['name']
            delete item['description']

            return item
        })        
        
        //const filtered = locations.filter((elem) => !anotherArray.find(({ id }) => elem.id === id) && elem.sub);
        // Filter all cities to only the list of feature cities. 
        const featured = this.state.featured
        const filtered = locations.filter(function (el) { return featured.indexOf(el.name) >= 0; });

        // Sort by location to user
        let ordered_locations = helpers.sortLocations(filtered, this.props.currentLocation)

        console.log('ordered_locations: ', ordered_locations, this.props.currentLocation)
        let distance_from_user = helpers.getDistance([this.props.currentLocation.longitude, this.props.currentLocation.latitude], ordered_locations[0].centerpoint)

        if(distance_from_user < 20) {
            console.log('SET AS CITY: ', ordered_locations[0]['id'])
            this.setState({ nearest: ordered_locations[0]['id'] })
        }
        
        this.setState({ locations: ordered_locations })
    }

    handleSearch = (e, { searchQuery }) => {
        console.log(searchQuery)

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

            if (item.zoom_start) {
                this.props.setZoom(item.zoom_start)
            }

            if (item.bearing_start) {
                this.props.setBearing(item.bearing_start)
            }

            this.props.setCurrentLocation({ latitude: item.centerpoint[1], longitude: item.centerpoint[0] })
            this.props.setDetailsId(null)
            this.props.setDetailsType(null)
            this.props.setDetailsShown(false)
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

        // TODO: How to add a divider between new results and other cities
        // TODO: load list from the API and store in Redux
        let options = this.state.locations.concat(this.state.results)

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
                placeholder='Near you'
                style={{ width : '12em', marginLeft: '0.6em', zIndex: '100' }}
            />
        );
    }
}

const mapStateToProps = state => ({
    bearing: state.bearing,
    geod: state.geod,
    cities: state.cities,  
    currentLocation: state.currentLocation,
    zoom: state.zoom
});

export default connect(mapStateToProps, actions)(LocationSearchInput);
