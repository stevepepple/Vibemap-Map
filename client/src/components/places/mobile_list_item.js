import React from 'react';
import { Item, Image, Label, List } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import moment from 'moment';
import helpers from '../../helpers';

class ListItem extends React.Component {

    handleHover(id) {
        helpers.fireEvent(this.props.id, "focus")
    }

    onMouseLeave(id) {
        helpers.fireEvent(this.props.id, "mouseleave")
    }

    render() {
        
        let title = this.props.content.name;
        //let start = this.props.content.start_time
        //let date = moment(this.props.content.start_date)
        //let score = Math.round(this.props.content.score)

        //console.log(this.props.content.categories)    
        //let categories = this.props.content.categories.map((category) => <span class={category}>Category</span>);

        let content = this.props.content;
        
        let vibes = null;
        if (typeof content.vibes !== "undefined") {
            vibes = content.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
        }

        let short_name = null
        if (content.short_description) {
            short_name = content.short_description 
        } else if (typeof (content.categories) == 'object') {
            short_name = content.categories[0]
        }

        console.log("Place content: ", content)

        /* TODO: Can this be made an abtract component for other types of data, i.e. places */
        /* TODO: Handle places & evnets */
        return (
            
            <List.Item className={'mobileListItem'} 
                onClick={((e) => this.props.onClick(e, this.props.id))}
                key={this.props.id} 
                data-id={content.id}
                style={{ 
                    flex: '0 0 auto',
                    height: '30vmin',
                    verticalAlign: 'top',
                    scrollSnapAlign: 'center',
                    width: '100%'
            }}>
                <Image src={this.props.content.images[0]} size='small' verticalAlign='top' />
                <List.Content 
                    size='large' verticalAlign='middle'
                    onMouseOver={this.handleHover.bind(this, this.props.id)} onMouseLeave={this.onMouseLeave.bind(this, this.props.id)}>
                    <span className='category'>{short_name}</span>
                    <List.Header textAlign='left'>{title}</List.Header>                
                    <Item.Extra>
                        
                        {/* 
                        <div>
                            {vibes}
                        </div>
                        */}
                        {/* 
                        <span className='interested'>
                            <Icon name='user' />
                            {score} Relevance
                        </span>
                        */}
                    </Item.Extra>
                </List.Content>
            </List.Item>
            
        );
    }
}

ListItem.propTypes = {
    content: PropTypes.object.isRequired,
    id: PropTypes.string,
    link: PropTypes.string,
    onclick: PropTypes.func
};

export default ListItem;