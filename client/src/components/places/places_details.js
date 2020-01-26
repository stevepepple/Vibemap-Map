import React, { Component } from 'react'

import isEqual from 'react-fast-compare'
import MetaTags from 'react-meta-tags'

import { Button, Dimmer, Header, Image, Label, List, Reveal, Placeholder } from 'semantic-ui-react'
import Directions from '../places/directions'
import VibeMap from '../../services/VibeMap.js'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import AppStoreLink from '../elements/AppStoreLink'
import ShowMoreText from 'react-show-more-text'

/* TODO: Break this into styles for each component */
import '../../styles/place_details.scss'

import moment from 'moment';

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
            vibes: [],
            images: []
        }
    }

    handleClose = function() {
        this.setState({ show : false})
        // Do something
    }

    componentDidMount = function() {
        console.log("UPdated place ID: ", this.props.id)
        this.getPlaceDetails()
    }

    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.id, this.props.id)) {
            this.getPlaceDetails()
        }
    }

    getPlaceDetails = function() {
        VibeMap.getPlaceDetails(this.props.id)
            .then(result => {
                console.log("Place details: ", result)
                
                // TODO: does this need to be in redux?
                this.setState({ 
                    details_data: result.data, 
                    name: result.data.properties.name,
                    description: result.data.properties.description,
                    categories: result.data.properties.categories,
                    images: result.data.properties.images,
                    vibes: result.data.properties.vibes,
                    loading : false })
                
                let point = result.data.geometry.coordinates
                
                // TODO: Helper function for coord to lat - long?
                this.props.setCurrentLocation({ latitude: point[1], longitude: point[0] })            
            })
    }

    render() {
        
        if (this.state.loading === false && this.state.details_data == null) { return 'No data for the component.' }

        /* TODO: Handle events and places in one place */
        
        let title = this.state.name + ' - VibeMap'

        let description = unescape(this.state.description)

        /* TODO: Make recommendation is own component */
        let recommendation = 
            <List.Item className='recomendation'>
                <Image avatar src={process.env.PUBLIC_URL + '/images/vibe_match.svg'}  />
                <List.Content>
                    <List.Header>Totally your vibe!</List.Header>
                </List.Content>
            </List.Item>

        // TODO: Make these components that handle mapping and errors.
        let categories = null
        if (this.state.categories.length > 0) {
            categories = this.state.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
        }

        let vibes = null
        if (this.state.vibes.length > 0) {
            vibes = this.state.vibes.map((vibe) => <Label key={vibe} className={'vibe pink label ' + vibe}>{vibe}</Label>);
        }
        

        let image = <Image className = 'placeImage' src={ process.env.PUBLIC_URL + '/images/image.png' } fluid />

        if (this.state.images.length > 0) {
            image = <Image className='placeImage' src={this.state.images[this.state.images.length - 1]} fluid size='medium' />
        }

        let directions = null

        if (this.state.details_data) {
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

                <Button onClick={this.props.clearDetails}>Back</Button>
       
                {this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Header>
                            <Placeholder.Line length='very short'/>
                            <Placeholder.Line length='medium' />
                        </Placeholder.Header>
                    </Placeholder>
                ): (
                    <Header>{this.state.name}</Header>
                )} 

                {this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    <List verticalAlign = 'middle'>
                        <List.Item>
                            <ShowMoreText
                                /* Default options */
                                lines={4}
                                more='Show more'
                                less='Show less'
                                anchorClass=''
                                onClick={this.executeOnClick}
                                expanded={false}
                            >
                                {description}
                            </ShowMoreText>
                        </List.Item>
                        { recommendation }
                        <List.Item>{vibes}</List.Item>
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
                <div>
                    {categories}
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

export default connect(mapStateToProps, actions)(PlaceDetails)