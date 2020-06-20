import React, { Component, Fragment } from 'react';
import { Grid, Menu, Dropdown, Image } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

import LocationSearchInput from '../map/search'


class Header extends Component {
    render() {
        return (
            <Menu id='header' borderless pointing>
                <Menu.Item>
                    <SVG style={{ width: '12em', padding: '1em' }} src='/images/logo-type.svg' />
                </Menu.Item>                

                <Menu.Menu position='right'>
                    <Menu.Item name='city' style={{ zIndex: '200'}}>
                        <SVG style={{ width: '2em' }} src='/images/logo-mark.svg' />
                        <LocationSearchInput className='mobile search' />

                    </Menu.Item>
                    
                    <Menu.Item>
                        <Dropdown button labeled className='icon main_menu' icon='list' text='Menu'>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <Link to="/places">Nearby</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to="/calendar">Calendar</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to="/generator">Vibe Generator</Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to="/profile">Claim Places</Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>
                
            </Menu>
        );
    }
}

export default Header;

