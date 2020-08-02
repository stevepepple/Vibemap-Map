import React, { Component, createRef } from 'react'
import { withTranslation } from 'react-i18next';

import { Button, Dropdown, Form, Input, Segment } from 'semantic-ui-react'
import debounce from 'lodash.debounce'

import { connect } from "react-redux"
import * as actions from '../redux/actions'

import * as Constants from '../constants.js'
import DatePicker from '../components/elements/DatePicker.js'

import { Link } from 'react-router-dom';


class MobileSearch extends Component {

    searchRef = createRef()

    constructor(props) {
        super(props)

        this.state = {
            date_options: [
                { key: '1', text: 'Today', value: '1' },
                { key: '2', text: '2 days', value: '2' },
                { key: '3', text: '3 days', value: '3' },
                { key: '7', text: 'Week', value: '5' },
                { key: '14', text: '2 weeks', value: '14' }
            ],
            place_types: ['places', 'events', 'both']
        }

        this.goBack = this.goBack.bind(this);

    }

    componentDidMount() {
        this.searchRef.current.focus()
    }

    onChange = (e, { value }) => {
        console.log('Search changed: ', value)
        this.props.setSearchTerm(value)
    }

    handleActivityChange = (e, { value }) => {
        this.props.setActivity(value)
    }

    handleDaysChange = (e, { value }) => {
        console.log("handleDaysChange: ", value)
        this.props.setDays(value)
    }

    handleTypes = (value) => {
        this.props.setPlaceType(value)
    }

    goBack() {
        this.props.history.goBack();
    }

    render() {

        const { date_options, place_types } = this.state
        const { activity, days, placeType, searchTerm, selected_activity, t } = this.props

        return (
            <Segment.Group className='Search'>

            <Segment basic>

                <Button onClick={this.goBack}>Back</Button>

                <Input
                    className='listSearch'
                    fluid
                    placeholder={t('Search')}
                    icon='search'
                    iconPosition='left'
                    onChange={debounce(this.onChange, 500, {
                        leading: true,
                    })}
                    ref={this.searchRef}
                    size='large'
                    value={searchTerm} />
            </Segment>
            <Segment>
                <Button.Group fluid>
                    {place_types.map((option) => (
                        <Button key={option} active={option === placeType} onClick={this.handleTypes(option)}>{t(option)}</Button>
                    ))}
                </Button.Group>
            </Segment>
            <Segment>
                <Dropdown
                    //button
                    className='icon basic small'
                    clearable
                    //icon={this.state.selected_activity.label.icon}
                    //labeled
                    style={{ lineHeight: '2.4em', marginLeft: '0.4em' }}
                    //placeholder={t('Activities')}
                    onChange={this.handleActivityChange}
                    //options={Constants.main_categories}
                    text={t(selected_activity.text)}
                    value={activity}>
                    <Dropdown.Menu>
                        {Constants.main_categories.map((option) => (
                            <Dropdown.Item key={option.value} label={option.label} onClick={this.handleActivityChange} text={t(option.text)} value={option.value} />
                        ))}
                        <Dropdown.Divider />
                        {Constants.activty_categories.map((option) => (
                            <Dropdown.Item key={option.value} label={option.label} onClick={this.handleActivityChange} text={t(option.text)} value={option.value} />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Segment>
            <Segment>
                <Dropdown
                    className='basic'
                    labeled
                    text={t(date_options.find(obj => obj.value === days).text)}
                    value={days}>
                    <Dropdown.Menu>
                        {date_options.map((option) => (
                            <Dropdown.Item key={option.value} text={t(option.text)} onClick={this.handleDaysChange} value={option.value} />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

            </Segment>
            <Segment basic>
                <Link to='/discover/'>
                    <Button fluid secondary>{t('Search')}</Button>
                </Link>
            </Segment>
            </Segment.Group>
        )
    }
}

const mapStateToProps = state => ({
    activity: state.nav.activity,
    currentItem: state.places.currentItem,
    days: state.nav.days,

    loading: state.places.loading,
    placeType: state.nav.placeType,
    searchTerm: state.nav.searchTerm,
    selected_activity: state.nav.selected_activity,
    vibesets: state.nav.vibesets
});

export default connect(mapStateToProps, actions)(withTranslation()(MobileSearch));