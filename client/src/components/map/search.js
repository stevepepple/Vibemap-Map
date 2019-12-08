import React from 'react';
import { Search, Dropdown } from 'semantic-ui-react'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions';

import helpers from '../../helpers.js'

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';


class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            address: '',
            best: null, 
            results : [],
            // TODO: update Admin pannel with this value and pull from API
            locations: [
                { "id": "31c71dc4-b861-42a3-b722-03d52894fc24", "text": "Austin, TX", "value": "austin", "name": "Austin-Round Rock, TX Metro Area", "description": null, "centerpoint": [-97.65444655424398, 30.262609025602593], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "a207c7df-4f84-4d8e-8839-84b246ede716", "text": "Boston, MA", "value": "boston", "name": "Boston-Cambridge-Newton, MA-NH Metro Area", "description": null, "centerpoint": [-71.02192727231369, 42.51789894269843], "zoom_start": 13, "bearing_start": null, "pitch_start": null }, 
                { "id": "56a56e10-460e-40d0-a72f-58b04bd051b4", "text": "Chicago, IL", "value": "chicago", "name": "Chicago-Naperville-Elgin, IL-IN-WI Metro Area", "description": null, "centerpoint": [-87.829623137516, 41.824839540182225], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "9320479f-3ff3-4542-b8b8-938d8935b495", "text": "Dallas, TX", "value": "dallas", "name": "Dallas-Fort Worth-Arlington, TX Metro Area", "description": null, "centerpoint": [-97.02519305892125, 32.818153180168665], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "a2a38afe-f0e1-445c-92eb-7518acdaaf82", "text": "Denver, CO", "value": "denver", "name": "Denver-Aurora-Lakewood, CO", "description": null, "centerpoint": [-104.98755003471857, 39.73998623841923], "zoom_start": 13, "bearing_start": null, "pitch_start": null }, 
                { "id": "6e31a0eb-e654-4405-80b3-c7aa01c68191", "text": "Guadalajara, MX", "value": "guadalajara", "name": "Guadalajara", "description": "", "centerpoint": [-103.32267587463409, 20.656168982503225], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "2a776095-98c2-45d0-9607-193f34586dfb", "text": "Indianapolis, IN", "value": "indianapolis", "name": "Indianapolis-Carmel-Anderson, IN Metro Area", "description": null, "centerpoint": [-86.20613804576381, 39.74743133204517], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "28e5b449-f2ca-4d3b-a8b4-c57cf049f5d1", "text": "Kansas City, MO", "value": "kansas_city", "name" : "Kansas City, MO-KS Metro Area", "description": null, "centerpoint": [-94.44439829770525, 38.93718341523665], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "c9a66e10-a1c4-482b-b47f-03d33c87495a", "text": "Los Angeles", "value": "la", "name": "Los Angeles-Long Beach-Anaheim, CA", "description": null, "centerpoint": [-118.24885469722918, 34.04084485201012], "zoom_start": 12, "bearing_start": null, "pitch_start": null }, 
                { "id": "2a55b81d-3a29-4ffa-befc-accba234d994", "text": "Louisville, KY", "value": "louisville", "name": "Louisville/Jefferson County, KY-IN Metro Area", "description": null, "centerpoint": [-85.67084858950163, 38.33674952468235], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "4505fd97-4768-47bf-b653-e8da5e381d4c", "text": "New York, NY", "value": "new_york", "name": "New York-Newark-Jersey City, NY-NJ-PA Metro Area", "description": null, "centerpoint": [-73.90241970241001, 40.89842231474656], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "6ea3142b-f1b6-4fce-8484-b7c8b0a32473", "text": "North America difference (temp)", "value": "north_america", "name": "North America difference (temp)", "description": null, "centerpoint": [-100.17577749141557, 35.232344815909016], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "1fc95260-6940-4757-bb26-39b03686fb88", "text": "Portland, OR", "value": "portland", "name": "Portland-Vancouver-Hillsboro, OR-WA", "description": null, "centerpoint": [-122.66829009841561, 45.5201615939854], "zoom_start": 13, "bearing_start": null, "pitch_start": null }, 
                { "id": "2f86fd6b-3cdc-41f3-92ae-b41dc2101662", "text": "San Diego, CA", "value": "san_diego", "name": "San Diego-Carlsbad, CA Metro Area", "description": null, "centerpoint": [-117.16043619274888, 32.71225022917529], "zoom_start": 13, "bearing_start": null, "pitch_start": null }, 
                { "id": "2b22ebd8-d96d-4396-9033-3f296293a968", "text": "San Francisco, CA", "value": "sf", "name": "San Francisco-Oakland-Hayward, CA", "description": null, "centerpoint": [-122.44188920194642, 37.76372517208057], "zoom_start": 12, "bearing_start": -4, "pitch_start": null }, 
                { "id": "2b22ebd8-d96d-4396-9033-3f296293a968", "text": "Oakland, CA", "value": "oakland", "name": "Oakland, CA", "description": null, "centerpoint": [-122.26974770439848, 37.79926844695808], "zoom_start": 13.2, "bearing_start": 24, "pitch_start": null }, 
                { "id": "142ed33f-d405-489e-9d14-bd71486a08e5", "text": "Seattle, WA", "value": "seattle", "name": "Seattle-Tacoma-Bellevue, WA", "description": null, "centerpoint": [-122.3320708, 47.6062095], "zoom_start": 12, "bearing_start": null, "pitch_start": null }, 
                { "id": "d5cbfdc0-789c-4cd9-8d32-0e75b944fbca", "text": "St. Louis, MO", "value": "st_louis", "name": "St. Louis, MO-IL Metro Area", "description": null, "centerpoint": [-90.35010496116666, 38.735268712355776], "zoom_start": null, "bearing_start": null, "pitch_start": null }, 
                { "id": "bf753c41-259b-4f7b-bf43-44ab0fe4be57", "text": "Vancouver, CA", "value": "vancouver", "name": "Vancouver", "description": null, "centerpoint": [-123.12244587079275, 49.280629712109175], "zoom_start": 13, "bearing_start": null, "pitch_start": null },
            ]
        }

        this.handleSearch = this.handleSearch.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
    }

    componentWillMount() {
        let ordered_locations = helpers.sortLocations(this.state.locations, this.props.currentLocation)
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


                        this.setState({ 
                            results: new_locations 
                        })

                    })
            });    
        }   
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = (e, { value }) => {
        
        let item = this.state.locations.find(o => o.value == value)

        console.log("Changed select box", value, item)

        if(item) {
            if (item.zoom_start) {
                this.props.setZoom(item.zoom_start)
            }

            if (item.bearing_start) {
                this.props.setBearing(item.bearing_start)
            }

            this.props.setCurrentLocation({ latitude: item.centerpoint[1], longitude: item.centerpoint[0] })
            this.props.setDetailsId(null)
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
                icon='compass'
                labeled
                floating
                selection
                onSearchChange={this.handleSearch}
                onChange={this.handleSelect}
                options={options}
                defaultValue="sf"
                placeholder='Near by'
            />
        );
    }
}

const mapStateToProps = state => ({
    bearing: state.bearing,
    geod: state.geod,    
    currentLocation: state.currentLocation,
    zoom: state.zoom
});

const mapDispatchToProps = dispatch => ({
    setLocation: location => dispatch(actions.setCurrentLocation(location))
})

export default connect(mapStateToProps, actions)(LocationSearchInput);
