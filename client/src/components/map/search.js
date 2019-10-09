import React from 'react';
import { Search, Dropdown } from 'semantic-ui-react'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions';

import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            address: '',
            best: null, 
            results : [],
            locations: [
                { key: 'nearby', text: 'Nearby', coords: [42, -122], value: 'nearby' },
                { key: 'oakland', text: 'Oakland', coords: [42, -122], value: 'oakland' },
                { key: 'sf', text: 'San Francisco', coords :[42, -122], value: 'sf' },
                { key: 'portland', text: 'Portland', coords: [45.525781, -122.672448], value: 'portland' },
                { key: 'sanjose', text: 'San Jose', coords: [37.3, -121.8], value: 'sanjose' },
                { key: 'seattle', text: 'Seattle', coords: [45.525781, -122.672448], value: 'seattle' },
                { key: 'guadalajara', text: 'Guadalajara', coords: [20.67657143973132,-103.34742475872281], value: 'guadalajara' },
                { key: 'vancouver', text: 'Vancouver', coords: [42, -122], value: 'vancouver' },
                { key: 'cairo', text: 'Cairo', coords: [31.233155, 30.042124], value: 'cairo' } 
            ]
        }

        this.handleSearch = this.handleSearch.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
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
                                return { key: address.place_id, text: address.formatted_address, coords: [address.geometry.location.lat(), address.geometry.location.lng()], value: address.formatted_address }
                            }
                           
                        })

                        this.setState({ results: new_locations })

                        /*
                        getLatLng(results[0])
                            .then(best => this.setState({ best: best }))
                        */
                    })
            });    
        }   
        
        
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = (e, { value }) => {
        geocodeByAddress(value)
            .then(results => {

                this.setState({ results: results })

                getLatLng(results[0])
                    .then(best => this.setState({ best : best }))
                
            })
            .then(best => {
                //this.props.setPosition(this.state.best.lat, this.state.best.lng)
                this.props.setCurrentLocation({ latitude: this.state.best.lat, longitude: this.state.best.lng })

                console.log('Success', this.state.best)
            })
            .catch(error => console.error('Error', error));
    };

    render() {

        // TODO: How to add a divider between new results and other cities
        // TODO: load list from the API and store in Redux
        let options = this.state.locations.concat(this.state.results)

        return (
            <Dropdown
                clearable
                fluid
                search
                className='icon'
                icon='compass'
                labeled
                selection
                onSearchChange={this.handleSearch}
                onChange={this.handleSelect}
                options={options}
                placeholder='Near by'
            />

            /*
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="ui search">
                        <div className="ui icon input">
                            <input className='ui search prompt' type="text" tabIndex="0" autoComplete="off"
                                {...getInputProps({
                                    placeholder: 'Search Places ...',
                                    className: 'location-search-input',
                                })}
                            />
                            <i aria-hidden="true" className="search icon"></i>
                        </div>

                        <div className={"results transition autocomplete-dropdown-container " + (this.state.address.length > 1 ? 'visible' : '')}>
                            <div> Nearby </div>
                            {loading && <div className='ui'>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                )}
            </PlacesAutocomplete>
            */
        );
    }
}

const mapStateToProps = state => ({
    geod: state.geod,
    currentLocation: state.currentLocation
});

const mapDispatchToProps = dispatch => ({
    setLocation: location => dispatch(actions.setCurrentLocation(location))
})

export default connect(mapStateToProps, actions)(LocationSearchInput);
