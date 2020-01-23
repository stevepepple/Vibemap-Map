import React, { Component } from 'react'

import isEqual from 'react-fast-compare'
import MetaTags from 'react-meta-tags'

import { Button, Dimmer, Header, Image, Label, Loader, Reveal, Segment } from 'semantic-ui-react'
import Directions from '../places/directions'
import VibeMap from '../../services/VibeMap.js'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import AppStoreLink from '../elements/AppStoreLink'

import moment from 'moment';

class PlaceDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            id: this.props.id,
            details_data: null,
            directions: null, 
            loading: true
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
                // TODO: does this need to be in redux?
                this.setState({ details_data: result.data, loading : false })
                let point = result.data.geometry.coordinates
                
                // TODO: Helper function for coord to lat - long?
                this.props.setCurrentLocation({ latitude: point[1], longitude: point[0] })
                
            })
    }

    render() {
        // TODO: try this same technique in the map
        if (this.state.loading === true) { 
            return <Segment><Dimmer active inverted><Loader>Loading</Loader></Dimmer><Image src={process.env.PUBLIC_URL + '/images/short-paragraph.png'} /></Segment>
        }

        if (this.state.details_data == null) { return 'No data for the component.' }

        let content = this.state.details_data.properties;

        console.log("Place details: ", content)
        //let date = moment(content.date)
        
        // TODO: Make these components that handle mapping and errors.
        let categories = content.categories.map((category) => <Label key={category} className={'pink image label ' + category}>{category}</Label>);
        let vibes = content.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);

        let image = content.images[0]
        let title = content.name + ' - VibeMap'

        return (
            <div className='details'>

                <MetaTags>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta property="twitter:title" content={title} />

                    <meta property="og:description" content={content.description} />
                    <meta property="twitter:description" content={content.description} />

                    <meta property="og:image" content={image} />
                    <meta name="og:image" content={image} />
                    <meta name="twitter:image" content={image} />
                    
                </MetaTags>

                <Button onClick={this.props.clearDetails}>Back</Button>

                <Header>{content.name}</Header>
                <div>
                    {categories}
                </div>

                {/* TODO: Make image a component */}
                <Reveal animated='fade'>
                    <Reveal.Content visible>
                        <Image src='../../styles/image.png' size='small' />
                    </Reveal.Content>
                    <Reveal.Content hidden>
                        <Image size='medium' src={content.images[0]} />
                    </Reveal.Content>
                </Reveal>            

                {/* TODO: Render Description at HTML the proper way as stored in Mongo and then as own React component */}
                <div className='full_description' style={{ 'height': 'auto' }} dangerouslySetInnerHTML={{ __html: content.description }}></div>

                <div>
                    {vibes}
                </div>

                <h3>Details & Tickets</h3>
                <a className='ui button primary' href={content.url} target='_blank'> Check it out</a>
                <p className='small'>Event from {content.source}</p>

                <Directions data={this.state.details_data} />

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
        detailsId: state.detailsId,
        pathname: state.router.location.pathname,
        search: state.router.location.search,
        searchTerm: state.searchTerm
    }
}

export default connect(mapStateToProps, actions)(PlaceDetails)