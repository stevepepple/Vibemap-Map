import React, { Component, Fragment } from 'react'
import isEqual from 'react-fast-compare'

// TODO: Replace with Array.prototype.find
import find from 'lodash.find'

import SEO from '../../components/seo/'


import { Button, Divider, Icon, Image, Label, List, Reveal, Placeholder, Segment } from 'semantic-ui-react'
import Directions from '../places/directions'
import VibeMap from '../../services/VibeMap.js'
import * as Constants from '../../constants.js'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import AppStoreLink from '../elements/AppStoreLink'

import Header from '../places/header'
import Vibe from '../places/vibe'
import Plan from '../places/plan'
import Tip from '../elements/Tip'

import CardCarousel from './CardCarousel'

import ShowMoreText from 'react-show-more-text'

/* TODO: Break this into styles for each component */
import '../../styles/place_details.scss'

class PlaceDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            id: this.props.id,
            currentItem: this.props.currentItem,
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
        // Fetch guide details and walking path
        if(this.props.detailsType === 'guides') this.getGuideDetails()

        if (this.props.detailsType === 'events' || this.props.detailsType === 'places') this.getPlaceDetails()
    }

    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.id, this.props.id)) {
            this.getPlaceDetails()
        }

        if (!isEqual(prevProps.currentItem, this.props.currentItem)) {
            this.setState({ currentItem: this.props.currentItem })
        }
    }

    // TODO: Move this module to layouts and make this function more explicitly agnostic to type. 
    getPlaceDetails = function() {
        const { detailsId, detailsType, setCurrentItem, fetchDetails } = this.props

        let details = fetchDetails(detailsId, detailsType)
        
    }

    getGuideDetails = function () {
        const { detailsId, guidesData, setCurrentItem, setGuideDetails, setGuideMarkers } = this.props

        const selectedGuide = find(guidesData, function (o) { return o.id === detailsId })
        let guideDetails = selectedGuide['properties']

        let place_promises = guideDetails['places'].map((place) => VibeMap.getPlaceDetails(place['id'], 'places'))

        Promise.all(place_promises).then(function (places) {
            let guideMarkers = places.map((place) => place['data'])

            setGuideMarkers(guideMarkers)

            setCurrentItem({
                name: guideDetails.name,
                description: guideDetails.description,
                categories: guideDetails.categories,
                images: guideDetails.images,
                places: guideMarkers,
                tips: guideDetails.tips,
                vibes: guideDetails.vibes
            })

        })

        let waypoints = guideDetails['places'].map((place) => place['coordinates'])

        VibeMap.getDirections(waypoints)
            .then(result => {

                let bestRoute = result['data']['routes'][0]

                let geojson = {
                    type: 'Feature',
                    properties: {
                        distance: bestRoute['distance']
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: bestRoute['geometry']['coordinates']
                    }
                }

                // Join guide and route and save in Redux
                guideDetails.route = geojson
                setGuideDetails(guideDetails)

                this.setState({ currentItem: guideDetails, loading: false })
            })
    }

    toggleMoreVibes() {
        this.setState({ vibes_expanded: !this.state.vibes_expanded })
    }

    render() {

        const { vibes_expanded, vibes_to_show } = this.state
        const { loading, currentItem } = this.props
        
        if (loading === false && currentItem == null) { return 'No data for the component.' }

        /* TODO: Handle events and places in one place */
        
        let title = this.props.currentItem.name + ' - VibeMap'
        let name = this.props.currentItem.name
        let description = unescape(this.props.currentItem.description)

        let profile = <Fragment>
            <Header loading={loading} currentItem={currentItem} />
            <Vibe loading={loading} currentItem={currentItem} vibes_expanded={vibes_expanded} />
            <Plan loading={loading} currentItem={currentItem} />
        </Fragment>

        console.log(currentItem)

        console.log('Place description: ', description, typeof(description))

        /* TODO: Make recommendation is own component */
        if (this.props.currentItem.reason === undefined) this.props.currentItem.reason = 'vibe'
        let reason = Constants.RECOMMENDATION_REASONS[this.props.currentItem.reason]
        
        let recommendation = 
            <List.Item className='recomendation'>
                <Icon name='heartbeat' color='green' />                
                <List.Content>
                    <List.Header>{reason}</List.Header>
                </List.Content>
            </List.Item>

        // TODO: Make these components that handle mapping and errors.
        let categories = null
        if (this.props.currentItem.categories.length > 0) {
            categories = this.props.currentItem.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
        }

        let vibes = null
        if (this.props.currentItem.vibes.length > 0) {
            if (vibes_expanded === false) {
                vibes = currentItem.vibes.slice(0, vibes_to_show).map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
            } else {
                vibes = currentItem.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
            }
        }

        let image = <Image className = 'placeImage' src={ process.env.PUBLIC_URL + '/images/image.png' } fluid/>
        let num_images = currentItem.images.length
        if (num_images > 0) {
            image = <Image className='placeImage' src={currentItem.images[num_images - 1]} fluid />
        }

        let directions = null

        if (currentItem && this.state.show_directions) {
            directions = <Directions data={currentItem} />
        }

        let places = null
        if (currentItem && currentItem.places !== undefined) {
            console.log('Details data: ', currentItem.places)
            let items = currentItem.places.map((place, i) => <List.Item key={place.properties.id}>
                <Label circular key={i} color='blue' style={{ float: 'left'}}>{i + 1}</Label>
                <List.Content>
                    <strong>{place.properties.name}</strong>
                    {place.properties && place.properties.tips &&
                        <List.Description>{place.properties.tips[0]}</List.Description>
                    }
                </List.Content>
            </List.Item>)

            places = <List divided>{items}</List>
        }

        let tips = null
        if (currentItem && currentItem.tips !== undefined) {
            let all_tips = currentItem.tips.map((tip) => <Tip text={tip}/>)
            tips = <CardCarousel items={all_tips} />
            
        }

        return (
            <div className='details'>
                <SEO 
                    title={title}
                    description={description}
                    img={image.src} />
                
                <Divider hidden />
                <Button basic icon='settings' onClick={this.props.clearDetails}>Back</Button>                
    
                {profile} 

                {this.state.loading ? (
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    <List verticalAlign='middle'>
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
                            {(this.state.vibes_expanded === false && this.props.currentItem.vibes.length > this.state.vibes.length) &&
                                <Button basic onClick={this.toggleMoreVibes} className='tiny' icon='arrow down' circular />
                            }

                            { this.state.vibes_expanded === true &&
                                <Button basic onClick={this.toggleMoreVibes} className='tiny' icon='arrow up' circular />
                            }
                        </List.Item>
                    </List>
                )}                

                { loading ? (
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

                {places &&
                    <Segment.Group>
                        {places}
                    </Segment.Group>
                }

                {tips &&
                    <Segment basic>
                        {tips}
                    </Segment>
                }

                {loading ? (
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    <Segment.Group>                    
                        <Segment>{categories ? categories : 'No categories'}</Segment>
                        <Segment>{this.props.currentItem.hours ? this.props.currentItem.hours : 'No hours' }</Segment>
                        <Segment>{this.props.currentItem.address ? this.props.currentItem.address: 'No address' }</Segment>
                        <Segment>{this.props.currentItem.url ? this.props.currentItem.url : 'No website' }</Segment>
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
        activity: state.nav.activity,
        detailsId: state.places.detailsId,
        loading: state.places.detailsLoading,
        detailsType: state.detailsType,
        nearby_places: state.nearby_places,
        currentLocation: state.nav.currentLocation,
        currentItem: state.places.currentItem,
        guidesData: state.guidesData,
        guideMarkers: state.guideMarkers,
        zoom: state.map.zoom,
        days: state.nav.days,
        currentDistance: state.currentDistance,
        vibes: state.nav.vibes,
        searchTerm: state.nav.searchTerm
    }
}

export default connect(mapStateToProps, actions)(PlaceDetails)