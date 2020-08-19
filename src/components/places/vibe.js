import React, { Fragment, useState }  from 'react'
import { withTranslation } from 'react-i18next';

import { Placeholder, Image, Label, Segment, Reveal } from 'semantic-ui-react'

import parse from 'html-react-parser'
import ShowMoreText from 'react-show-more-text'

import CardCarousel from '../layouts/CardCarousel'

const Vibe = (props) => {

    const [vibes_expanded, set_vibes_expanded] = useState(false)
    // Set the number of vibes to show with default of 4
    const [vibes_to_show, set_vibes_to_show] = useState(4)

    const { loading, t } = props
    let { vibes, description, categories, images, offers, tips, vibemap_images } = props.currentItem

    let image = <Image className='placeImage' src={process.env.PUBLIC_URL + '/images/image.png'} fluid />

    let num_images = vibemap_images.length
    let all_images = null
    if (num_images > 0) {
        all_images = vibemap_images.map((image) => <Image className='placeImage' src={image.original} fluid />)
        //image = <Image className='placeImage' src={images[num_images - 1]} fluid />
    }

    if (vibes.length > 0) {
        if (vibes_expanded === false) {
            vibes = vibes.slice(0, vibes_to_show).map((vibe) => 
                <Label key={vibe} className={'vibe label ' + vibe}>{t(vibe)}</Label>);
        } else {
            vibes = vibes.map((vibe) =>
                <Label key={vibe} className={'vibe label ' + vibe}>{t(vibe)}</Label>);
        }
    }

    let has_offers = (offers && offers.length > 0) ? true : false

    if (categories.length > 0) {
        categories = categories.map((category) => <Label key={category} className={'label ' + category}>{t(category)}</Label>);
    }

    const toggleMoreVibes = function() {
        set_vibes_expanded(!vibes_expanded)
    }

    let top_tip = null
    if (tips.length > 0) top_tip = tips[0]

    return <section id='vibe' name='vibe'>
        {loading ? (
            <Placeholder>
                <Placeholder.Image square />
            </Placeholder>
        ) : (
                <Fragment>
                    <Reveal animated='fade'>
                        <Reveal.Content hidden>
                            {num_images > 0 &&
                                <CardCarousel
                                    height={'24rem'}
                                    imageGallery={true}
                                    items={all_images} />
                            }                        
                        </Reveal.Content>
                    </Reveal>
                </Fragment>
            )}

        {
            props.loading ? (
                <Placeholder>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>
            ) : (
                <div>
                    { has_offers &&
                            <Segment vertical>
                                <h4>{t('FRESH VIBES')}</h4>
                                <p><strong>{offers[0].name}</strong> {offers[0].description}</p>
                                {offers[0].link &&
                                    <a href={offers[0].link} target='_blank'>Check it out</a>
                                }
                            </Segment>

                    }
                    <Segment vertical>
                        <h4>{t('Vibe')}</h4>
                        {vibes.length > 0 ? vibes : t('Add the first vibe...')}

                            <a onClick={toggleMoreVibes}>{vibes_expanded ? t('Show less') : t('Show more')}</a>
                    </Segment>
                    <Segment vertical>
                        <ShowMoreText
                            /* Default options */
                            lines={4}
                            keepNewLines={true}
                            more={t('Show more')}
                            less={t('Show less')}
                            expanded={false}
                        >
                        {description ? parse(description) : t('No description')}
                        </ShowMoreText>

                    </Segment>
                    <Segment vertical>
                        <h4>{t('Activities')}</h4>
                        {categories ? categories : t('No categories')}
                    </Segment>
                    <Segment vertical>
                        <h4>{t('Highlight')}</h4>
                        {top_tip ? top_tip : t('Add the first tip...')}
                    </Segment>
                </div>
            )
        }
    </section>
}

export default withTranslation()(Vibe) 