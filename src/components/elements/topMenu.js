import React, { Component } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'

import { Link } from "react-router-dom"

import "../../styles/topMenu.scss"

class TopMenu extends Component {

    constructor(props) {
        super(props)

        this.state = {
            domain: 'https://thirsty-northcutt-9dfc94.netlify.app',
            links: [
                { text: 'Our Story', link: '/our-story/why-vibes/', target: '_self'},
                { text: 'For Businesses', link: '/for-businesses/', target: '_self'},
                { text: 'Partners', link: '/partners/', target: '_self' },

                /*
                    <li class="post post-id-2736 "><a href="/our-story/why-vibes/">Our Story</a></li>
                    <li class="post post-id-2971 "><a href="/for-businesses/">For Businesses</a></li>
                    <li class="post post-id-161 "><a href="/partners/">Partners</a></li>
                    <li class="post post-id-162 "><a target="_blank" rel="noreferrer noopener" href="#" title="Newsletter">Newsletter</a></li>
                    <li><button href="#">Log In<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 18C4.03714 18 0 13.9629 0 9C0 4.03714 4.03714 0 9 0C13.9629 0 18 4.03714 18 9C18 13.9629 13.9629 18 9 18ZM9 1.28571C4.74643 1.28571 1.28571 4.74643 1.28571 9C1.28571 13.2536 4.74643 16.7143 9 16.7143C13.2536 16.7143 16.7143 13.2536 16.7143 9C16.7143 4.74643 13.2536 1.28571 9 1.28571Z" fill="white"></path><path d="M8.99978 8.04286C7.56907 8.04286 6.40479 6.87857 6.40479 5.44786C6.40479 4.01715 7.56907 2.85286 8.99978 2.85286C10.4305 2.85286 11.5948 4.01715 11.5948 5.44786C11.5948 6.87857 10.4305 8.04286 8.99978 8.04286ZM8.99978 4.13929C8.27764 4.13929 7.6905 4.72643 7.6905 5.44857C7.6905 6.17072 8.27764 6.75715 8.99978 6.75715C9.72193 6.75715 10.3091 6.17 10.3091 5.44786C10.3091 4.72572 9.72193 4.13929 8.99978 4.13929Z" fill="white"></path><path d="M13.5462 14.075H12.2605V11.13C12.2605 10.525 11.7684 10.0328 11.1634 10.0328H6.83549C6.23049 10.0328 5.73835 10.525 5.73835 11.13V14.075H4.45264V11.13C4.45264 9.81641 5.52121 8.74712 6.83549 8.74712H11.1641C12.4776 8.74712 13.5469 9.81569 13.5469 11.13V14.075H13.5462Z" fill="white"></path></svg></button></li>

                */
            ]
        }
    }


    render() {
        const { domain, links } = this.state

        const navItems = links.map((item) => {
            const link = domain + item.link
            return <li key={link}>
                    <a 
                        href={link}
                        target={item.target} 
                        title={item.text}>{item.text}</a></li>
        })

        return (
            <nav className="top-menu">
                <div className="container">
                    <ul name="Top Navigation" class="menu menu-top-navigation">
                        {navItems}
                        <li className="post post-id-162 "><a target="_blank" rel="noreferrer noopener" href="#" title="Newsletter">Newsletter</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default TopMenu;

