import React, { Component } from 'react'

import isEqual from 'react-fast-compare'
import MetaTags from 'react-meta-tags'

import { Button, Divider, Header, Icon, Image, Label, List, Reveal, Placeholder, Segment } from 'semantic-ui-react'
import Directions from '../places/directions'
import VibeMap from '../../services/VibeMap.js'
import * as Constants from '../../constants.js'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import AppStoreLink from '../elements/AppStoreLink'
import ShowMoreText from 'react-show-more-text'

/* TODO: Break this into styles for each component */
import '../../styles/place_details.scss'

import moment from 'moment';
import { constants } from 'buffer'

class PlaceDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            id: this.props.id,
            details_data: null,
            directions: null,                     
            loading: true,
            name: null,
            description: null,
            categories: [],
            show_directions: false,
            vibes: [],
            vibes_expanded: false,
            vibes_to_show: 8,
            images: []
        }

        this.toggleMoreVibes = this.toggleMoreVibes.bind(this)

    }

    handleClose = function() {
        this.setState({ show : false})
        // Do something
    }

    componentDidMount = function() {        
        this.getPlaceDetails()
    }

    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.id, this.props.id)) {
            this.getPlaceDetails()
        }
    }

    getPlaceDetails = function() {
        VibeMap.getPlaceDetails(this.props.detailsId, this.props.detailsType)
            .then(result => {
                
                // Handle Error
                if (result.data.detail === 'Not found.') {
                    this.setState({ details_data: null, loading: false})
                } else  {
                    this.setState({ details_data: result.data, loading: false })
                    let point = result.data.geometry.coordinates
                    let location = { latitude: point[1], longitude: point[0] }

                    // TEMPORARILY HANDLE MISSING VIBES
                    if (typeof result.data.properties.vibes === 'undefined') {
                        result.data.properties.vibes = []
                    }

                    this.props.setCurrentPlace({
                        name: result.data.properties.name,
                        description: result.data.properties.description,
                        categories: result.data.properties.categories,
                        address: result.data.properties.address,
                        hours: result.data.properties.hours,
                        phone: result.data.properties.phone,
                        instagram: result.data.properties.phone,
                        location: location,
                        images: result.data.properties.images,
                        reason: result.data.properties.reason,
                        tips: result.data.properties.tips,
                        vibes: result.data.properties.vibes,
                        url: result.data.properties.url,
                    })
                    // TODO: Helper function for coord to lat - long?
                    this.props.setCurrentLocation(location)
                }            
            })
    }

    toggleMoreVibes() {
        this.setState({ vibes_expanded: !this.state.vibes_expanded })
    }

    render() {
        
        if (this.state.loading === false && this.state.details_data == null) { return 'No data for the component.' }

        /* TODO: Handle events and places in one place */
        
        let title = this.props.currentPlace.name + ' - VibeMap'
        let name = this.props.currentPlace.name
        let description = unescape(this.props.currentPlace.description)

        console.log('Place description: ', description, typeof(description))

        /* TODO: Make recommendation is own component */
        if (this.props.currentPlace.reason === undefined) this.props.currentPlace.reason = 'vibe'
        let reason = Constants.RECOMMENDATION_REASONS[this.props.currentPlace.reason]
        
        let recommendation = 
            <List.Item className='recomendation'>
                <Icon name='heartbeat' color='green' />                
                <List.Content>
                    <List.Header>{reason}</List.Header>
                </List.Content>
            </List.Item>

        // TODO: Make these components that handle mapping and errors.
        let categories = null
        if (this.props.currentPlace.categories.length > 0) {
            categories = this.props.currentPlace.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
        }

        let vibes = null
        if (this.props.currentPlace.vibes.length > 0) {
            if (this.state.vibes_expanded == false) {
                vibes = this.props.currentPlace.vibes.slice(0, this.state.vibes_to_show).map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
            } else {
                vibes = this.props.currentPlace.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
            }
            
        }

        let image = <Image className = 'placeImage' src={ process.env.PUBLIC_URL + '/images/image.png' } fluid/>
        let num_images = this.props.currentPlace.images.length
        if (num_images > 0) {
            image = <Image className='placeImage' src={this.props.currentPlace.images[num_images - 1]} fluid />
        }

        let directions = null

        if (this.state.details_data && this.state.show_directions) {
            directions = <Directions data={this.state.details_data} />
        }

        return (
            <div className='details'>

                <MetaTags>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta property="twitter:title" content={title} />

                    <meta property="og:description" content={this.state.description} />
                    <meta property="twitter:description" content={this.state.description} />

                    <meta property="og:image" content={image.src} />
                    <meta name="og:image" content={image.src} />
                    <meta name="twitter:image" content={image.src} />
                    
                </MetaTags>
                <Divider hidden />
                <Button basic icon='settings' onClick={this.props.clearDetails}>Back</Button>                
    
                {this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Header>
                            <Placeholder.Line length='very short'/>
                            <Placeholder.Line length='medium' />
                        </Placeholder.Header>
                    </Placeholder>
                ): (
                    <h2>{name}</h2>
                )} 

                {this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    <List verticalAlign = 'middle'>
                        <List.Item >
                            <ShowMoreText
                                /* Default options */
                                lines={4}
                                more='Show more'
                                less='Show less'
                                anchorClass=''
                                onClick={this.executeOnClick}
                                expanded={false}
                            >
                                {description && description !== 'null' ? description : 'No description'}
                            </ShowMoreText>
                        </List.Item>
                        { recommendation }
                        <List.Item>
                            {vibes}
                            {(this.state.vibes_expanded == false && this.props.currentPlace.vibes.length > this.state.vibes.length) &&
                                <Button basic onClick={this.toggleMoreVibes} className='tiny' icon='arrow down' circular />
                            }

                            { this.state.vibes_expanded == true &&
                                <Button basic onClick={this.toggleMoreVibes} className='tiny' icon='arrow up' circular />
                            }
                        </List.Item>
                    </List>
                )}                

                { this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Image square />
                    </Placeholder>
                ): (
                    <Reveal animated='fade'>
                        <Reveal.Content hidden>
                            {image}
                        </Reveal.Content>
                    </Reveal>            
                )}

                {this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    <Segment.Group>                    
                        <Segment>{categories ? categories : 'No categories'}</Segment>
                        <Segment>{this.props.currentPlace.hours ? this.props.currentPlace.hours : 'No hours' }</Segment>
                        <Segment>{this.props.currentPlace.address ? this.props.currentPlace.address: 'No address' }</Segment>
                        <Segment>{this.props.currentPlace.url ? this.props.currentPlace.url : 'No website' }</Segment>
                    </Segment.Group>
                    )}

                <div>
                    
                </div>                        

                {/* TODO: Render Description at HTML the proper way as stored in Mongo and then as own React component */}

                {/* TODO: Make this a reservation area 
                <h3>Details & Tickets</h3>
                <a className='ui button primary' href={content.url} target='_blank'> Check it out</a>
                <p className='small'>Event from {content.source}</p>
                */}

                {directions}

                <AppStoreLink/>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        activity: state.activity,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        nearby_places: state.nearby_places,
        currentLocation: state.currentLocation,
        currentPlace: state.currentPlace,
        zoom: state.zoom,
        currentDays: state.currentDays,
        currentDistance: state.currentDistance,
        currentVibes: state.currentVibes,
        pathname: state.router.location.pathname,
        search: state.router.location.search,
        searchTerm: state.searchTerm
    }
}

export default connect(mapStateToProps, actions)(PlaceDetails)