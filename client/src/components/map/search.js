import React from 'react';
import { Search, Dropdown } from 'semantic-ui-react'

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
                { key: 'guadalajara', text: 'Guadalajara', coords: [42, -122], value: 'guadalajara' },
                { key: 'vancouver', text: 'Vancouver', coords: [42, -122], value: 'vancouver' }                
            ]
        };
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
                this.props.setPosition(this.state.best.lat, this.state.best.lng)
                console.log('Success', this.state.best)
            })
            .catch(error => console.error('Error', error));
    };

    render() {

        // TODO: How to add a divider between new results and other cities
        let options = this.state.locations.concat(this.state.results)

        return (
            <Dropdown
                clearable
                button
                fluid
                search
                className='icon'
                icon='compass'
                labeled
                selection
                onSearchChange={this.handleSearch}
                onChange={this.handleSelect}
                options={options}
                placeholder='Pick a City'
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

export default LocationSearchInput;