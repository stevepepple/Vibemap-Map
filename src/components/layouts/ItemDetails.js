import React, { Component, Fragment } from 'react'
import isEqual from 'react-fast-compare'
import { Link } from "react-router-dom"
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import debounce from 'lodash.debounce'
import find from 'lodash.find'

import SEO from '../../components/seo/'

import { Button, Divider, Icon, Image, Label, List, Popup } from 'semantic-ui-react'
import VibeMap from '../../services/VibeMap.js'
import * as Constants from '../../constants.js'

import Header from '../places/header'
import Vibe from '../places/vibe'
import Plan from '../places/plan'
import Tips from '../places/tips'
import AppStoreLink from '../elements/AppStoreLink'
import SocialShare from '../elements/SocialShare'

import '../../styles/place_details.scss'

class PlaceDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            id: this.props.id,
            currentItem: this.props.currentItem,
            currentSection: 'vibe',
            loading: true,
            name: null,
            description: null,
            categories: [],
            offset: 100,
            showTabs: false,
            vibes: [],
            vibes_to_show: 8,
            images: [],
            sections: [
                { key: 'vibe', text: 'Vibe' },
                { key: 'plan', text: 'Plan' },
                { key: 'tips', text: 'Tips' },
                { key: 'more', text: 'More' },
            ]
        }

        this.scrollToTab = this.scrollToTab.bind(this)
        this.detectSections = this.detectSections.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.savePlace = this.savePlace.bind(this)

    }

    handleClose = function() {
        this.setState({ show : false})
        // Do something
    }

    componentDidMount = function() { 
        const { detailsId, savedPlaces } = this.props
        // Fetch guide details and walking path
        if(this.props.detailsType === 'guides') this.getGuideDetails()

        if (this.props.detailsType === 'events' || this.props.detailsType === 'places') this.getPlaceDetails()
    
        this.detectSections()

        // Is current item saved?
        const foundIndex = savedPlaces.findIndex(obj => obj.id === detailsId)
        this.setState({ isSaved: (foundIndex > -1) ? true : false })

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

        // TODO: Move to redux and service
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

    detectSections() {
        const { offset } = this.state
        const { sections } = this.props

        let sections_with_bounds = sections

        sections_with_bounds.forEach((item) => {
            const element = document.getElementById(item.key) 
            const bounds = element.getBoundingClientRect()
            const offsetTop = element.offsetTop
            const offsetHeight = element.offsetHeight

            item.top = offsetTop - 200
            item.bottom = item.top + offsetHeight
            console.log('tab section bounds (top, bottom): ', item.top, item.bottom)

        })

        this.setState({ sections: sections_with_bounds })
    }

    handleScroll(event) {
        
        this.detectSections()

        const { clientHeight, scrollHeight, scrollTop } = event.target
        const { sections, currentSection } = this.state

        let offsetTop = window.pageYOffset;
        console.log('tab scrolling: ', scrollTop, scrollHeight, offsetTop)

        const scrolledDown = scrollTop > 160
        let current = null

        sections.forEach((item) => {
            if (scrollTop >= item.top && scrollTop < item.bottom ) {
                current = item.key
                console.log('New current tab: ', current)
            } 
        })

        this.setState({ showTabs: scrolledDown, currentSection: current })

        if (scrollHeight - scrollTop === clientHeight) {
            console.log('Scrolled to bottom!')
        }
    }


    scrollToTab(tab) {

        const { offset } = this.state
        // If browser    
        //window.scrollTo(0, this.moreRef.current.offsetTop)  
    
        //this.refs[tab].current.scrollIntoView(true)
        const details = document.getElementById('details')
        const anchorTarget = document.getElementById(tab)

        console.log('scrollToTab: ', anchorTarget.offsetTop)
        details.scrollTop = anchorTarget.offsetTop - 180

        // Set active tab after a slight delay (after scroll effect)
        setTimeout(this.setState({ currentSection: tab }), 200)
        
        //anchorTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    savePlace(id) {
        let { currentItem, savedPlaces, setCurrentItem, handleSavedPlace } = this.props
        console.log('Save place', id, currentItem, savedPlaces)

        handleSavedPlace(currentItem).then(isSaved => {
            // Flip the boolean
            currentItem.is_saved = !isSaved
            setCurrentItem(currentItem)
            this.setState({ isSaved: !isSaved })
        })

    }

    render() {

        const { currentSection, isSaved, vibes_expanded, vibes_to_show, sections, showTabs } = this.state
        const { loading, currentItem, detailsId, t } = this.props
        
        if (loading === false && currentItem == null) { return t("No data for the component.") }

        /* TODO: Handle events and places in one place */
        let title = this.props.currentItem.name + ' - VibeMap'
        let description = unescape(this.props.currentItem.description)

        // Recommendation
        if (currentItem.reason === undefined) currentItem.reason = 'vibe'
        const reason = Constants.RECOMMENDATION_REASONS[this.props.currentItem.reason]
        // TODO: connect so same logic as mobile 
        const recommendation = { score: '95%', reason: t(reason) }

        const tabs = sections.map((section) => {
            return <a
                className={(section.key === currentSection) ? 'active item' : 'item'}
                onClick={this.scrollToTab.bind(this, section.key)}>
                {section.text}
            </a>
        })

        let profile = <Fragment>            
            <Vibe loading={loading} currentItem={currentItem} vibes_expanded={vibes_expanded} />
            <Plan loading={loading} currentItem={currentItem} />
            <Tips loading={loading} currentItem={currentItem} />
        </Fragment>

        // Check if there's an image for SEO
        let preview_image = 'https://pbs.twimg.com/profile_images/1270800120452222977/GFhjmGCz_400x400.jpg'
        if (currentItem.images.length > 0) preview_image = currentItem.images[0]
        
        return (
            <div id='details' className='details' onScroll={this.handleScroll}>
                <SEO
                    title={title}
                    description={description}
                    img={preview_image} />

                <div className='header'>
                    <Button basic size='small' onClick={this.props.clearDetails}>{t("Back")}</Button>                    
                    
                    <div style={{ float: 'right' }}>
                        <Button color={isSaved ? 'black' : 'white'} onClick={this.savePlace.bind(this, detailsId)} circular icon='like' />
                        
                        <Popup
                            //on='click'
                            on={['click']}
                            pinned
                            position='bottom center'
                            style={{ width: '16rem' }}
                            trigger={<Button circular color='white' icon='share' />}>
                            <SocialShare />
                        </Popup>
                        
                    </div>
                    <Header 
                        loading={loading} 
                        currentItem={currentItem} 
                        recommendation={recommendation}
                        showPhoto={!showTabs} />
                    
                    {showTabs &&
                        <div className='ui pointing secondary menu'>
                            {tabs}
                        </div>
                    }
                </div>

                {profile}

                {/* TODO: Render Description at HTML the proper way as stored in Mongo and then as own React component */}

                {/* TODO: Make this a reservation area 
                <h3>Details & Tickets</h3>
                <a className='ui button primary' href={content.url} target='_blank'> Check it out</a>
                <p className='small'>Event from {content.source}</p>
                */}

                <section id='more' ref={this.moreRef}>
                    <h4>More</h4>
                    <AppStoreLink />

                    <Link to={'/details/' + detailsId}>
                        <Button basic fluid>{t("Check it out")}</Button>
                    </Link>
                </section>
                

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
        savedPlaces: state.savedPlaces,
        searchTerm: state.nav.searchTerm,
        sections: state.places.sections,
        vibes: state.nav.vibes,
    }
}

export default connect(mapStateToProps, actions)(withTranslation()(PlaceDetails))