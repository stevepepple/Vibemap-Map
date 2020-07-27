import React, { Component } from 'react';
import { Link } from "react-router-dom"
import { Menu, Dropdown } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'



class Header extends Component {

    render() {
        const domain = 'https://thirsty-northcutt-9dfc94.netlify.app'
        const links = [
            { text: 'Features', link: '/features/', target: '_self' },
            { text: 'Explore the map', current: true, link: '/dicover/', target: '_self' },
            { text: 'Cities', link: '/cities/', target: '_self' },
        ]

        let menuItems = links.map((item) => {
            const link = domain + item.link
            const linkStyle = item.current ? 'active' : 'inactive' 
            return <Menu.Item className='pageLink'>
                <a href={link} className={linkStyle} title={item.text}>
                    {item.text}
                </a>
            </Menu.Item>
        })

        return (
            <Menu id='header' borderless pointing style={{ margin: '0'}}>
                <Menu.Item>
                    <SVG style={{ width: '14em', padding: '1em' }} src='/images/logo-type.svg' />
                </Menu.Item>                
                <Menu.Menu className='pageMenu' position='right'>
                    {menuItems}
                </Menu.Menu>
                {/*
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
                */}

                
            </Menu>
        );
    }
}

export default Header;

