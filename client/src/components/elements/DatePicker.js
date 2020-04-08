// @flow 
import React, { Component } from 'react'
import { Translation } from 'react-i18next'
import { Dropdown } from 'semantic-ui-react'

class DatePicker extends Component {    
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Translation>{
                (t, { i18n }) =>
                    <Dropdown
                        button
                        className='icon left tiny datepicker'
                        icon='calendar'
                        onChange={this.props.handleChange}
                        text={t(this.props.text)}>
                        <Dropdown.Menu>
                            {this.props.options.map((option) => (
                                <Dropdown.Item key={option.value} text={t(option.text)} value={option.value} />
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
            }</Translation>
        )
    }
}


export default DatePicker;