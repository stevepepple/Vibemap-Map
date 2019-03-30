import React from 'react';
import { Search } from 'semantic-ui-react';
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
            results : [] 
        };
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
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
        return (
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
        );
    }
}

export default LocationSearchInput;