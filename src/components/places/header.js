import React from 'react'

import { Image, Placeholder, Reveal } from 'semantic-ui-react'

const Header = (props) => {
    const { loading, currentItem, recommendation } = props

    let image = <Image className='placeImage' src={process.env.PUBLIC_URL + '/images/image.png'} fluid />
    let num_images = currentItem.images.length
    if (num_images > 0) {
        image = <Image className='placeImage' src={currentItem.images[num_images - 1]} fluid />
    }

    console.log('image of ', num_images, image)
  
    return <div>
        {loading ? (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line length='very short' />
                    <Placeholder.Line length='medium' />
                </Placeholder.Header>
                <Placeholder>
                    <Placeholder.Image square />
                </Placeholder>
            </Placeholder>
        ) : (
            <div>
                <h2>{currentItem.name}</h2>

                {recommendation && 
                    <div className='recommendation'>
                        <span>{recommendation.score}</span>
                        {recommendation.reason}
                    </div>
                }
            </div>

        )}

        {loading ? (
            <Placeholder>
                <Placeholder.Image square />
            </Placeholder>
        ) : (
                <Reveal animated='fade'>
                    <Reveal.Content hidden>
                        {image}
                    </Reveal.Content>
                </Reveal>
            )}


    </div>
}

Header.defaultProps = {
    showRecommendation: true
}

export default Header