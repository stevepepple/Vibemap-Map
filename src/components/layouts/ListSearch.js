import React, { Component } from 'react'

// TODO: Doesn't this even work or can it be done with a smaller library
import debounce from 'lodash.debounce'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import helpers from '../../helpers';
import * as Constants from '../../constants.js'

import { Dimmer, Form, Input, Item, Loader, Pagination, Segment } from 'semantic-ui-react'

import styles from '../../styles/ListItems.scss'

import ListItems from '../layouts/ListItems.js'
import DatePicker from '../elements/DatePicker.js'

import { Translation } from 'react-i18next'

class PlacesList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            category_options: [],
            date_options: [
                { key: '1', text: 'Today', value: '1' },
                { key: '2', text: '2 days', value: '2' },
                { key: '3', text: '3 days', value: '3' },
                { key: '7', text: 'Week', value: '5' },
                { key: '14', text: '2 weeks', value: '14' }
            ],
            selected_activity: Constants.main_categories[0],
        }

        this.onClick = this.onClick.bind(this)
        this.onSavePlace = this.onSavePlace.bind(this)

        this.handleDaysChange = this.handleDaysChange.bind(this)
    }
    
    onChange = (e, { value }) => {
        console.log('Search changd: ', value)
        this.props.setSearchTerm(value)
    }

    handleDaysChange = (e, { value }) => {
        console.log("handleDaysChange: ", value)
        this.props.setDays(value)
        this.updateURL("days", value)
    }
    
    handlePage = (e, { activePage }) => {
        console.log('setCurrentPage: ', activePage)
        this.props.setCurrentPage(activePage)
    }

    onClick = (event, id, type) => { 
        this.props.setDetails(id, type)
    }

    onSavePlace = (event, place) => {

        const { handleSavedPlace } = this.props

        const isSaved = handleSavedPlace(place)
        
    }

    render() {
        let has_items = this.props.data && this.props.data.length > 0
        let items = null

        const { currentPage, searchTerm, totalPages }  = this.props

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            let max = helpers.getMax(this.props.data, 'score')
            items = this.props.data.map((place, index) => {
                return <ListItems 
                        key={place.id} 
                        id={place.id} 
                        type={place.properties.place_type} 
                        link={place.properties.url} 
                        onClick={this.onClick} 
                        onSavePlace={this.onSavePlace}
                        properties={place.properties} 
                        index={index} max={max}/>
            })
        }

        let date = <DatePicker 
                        handleChange={this.handleDaysChange.bind(this)}
                        options={this.state.date_options} 
                        text={(this.state.date_options.find(obj => obj.value === this.props.days).text)} />

        return (
            <Segment id='list' className={styles.list} compact>
                {/* TODO: Move to style sheet */}
                
                <Segment vertical basic>
                    <Form>                        
                        <Form.Field widths='equal'>
                            <Translation>{
                                (t, { i18n }) => <Input
                                    className='listSearch'
                                    fluid
                                    label={date}
                                    labelPosition='right'
                                    placeholder={t('Search')}
                                    icon='search'
                                    iconPosition='left'
                                    onChange={debounce(this.onChange, 500, {
                                        leading: true,
                                    })}
                                    size='large'                                
                                    value={searchTerm} />
                            }</Translation>                            
                        </Form.Field>                        
                    </Form>
                </Segment>
                
                {has_items? (
                    <Item.Group divided relaxed size='small' className='events_list'>
                        {items}

                        <Pagination
                            className='list_pagination'
                            fluid   
                            pointing
                            secondary
                            onPageChange={this.handlePage}
                            boundaryRange={1}
                            siblingRange={1}
                            totalPages={totalPages}
                            firstItem={false}
                            lastItem={false}
                            activePage={currentPage}
                        />
                    </Item.Group>
                ) : (
                    <Segment placeholder basic>
                        <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
                    </Segment>
                )}
                
            </Segment>
        );
    }
}

PlacesList.defaultProps = {
    showPagination: true
}

const mapStateToProps = state => {
    return {
        activity: state.nav.activity,
        allCategories: state.nav.allCategories,
        days: state.nav.days,
        currentPage: state.nav.currentPage,
        searchTerm: state.nav.searchTerm,
        detailsId: state.places.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown,
        placeType: state.nav.placeType,
        totalPages: state.nav.totalPages
    }
}

export default connect(mapStateToProps, actions)(PlacesList)