import React, { Fragment } from "react"

import { ButtonBack, ButtonNext, CarouselProvider, Dot, Slide, Slider } from "pure-react-carousel"
import { Button, Container } from "semantic-ui-react"
import "pure-react-carousel/dist/react-carousel.es.css"


export default class CardCarousel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            index: props.index
        }

    }

    render() {
        const { items, isMobile } = this.props 
        const slides = items.map((item, i) => <Slide index={i}>{item}</Slide>)

        console.log('slides: ', slides)
        const buttons = slides.map(slide => (
            <Button size='mini' as={Dot} key={slide} icon="circle thin small" slide={slide.props.index} />
        ))

        return (
            <CarouselProvider 
                naturalSlideWidth={0.8}
                naturalSlideHeight={1.5}
                totalSlides={items.length}
            >
                <Slider style={{ minHeight: '8em', maxHeight: '12em', width: '100%', padding: '0.2em' }}>
                    {slides}
                </Slider>

                {isMobile && 
                    <Fragment>
                        <Button circular as={ButtonBack} 
                            icon="arrow left" 
                            style={{ left: '0', bottom: '50%', position: 'absolute'}}
                            />
                    <Button circular as={ButtonNext} 
                            icon="arrow right" 
                            style={{ right: '0', bottom: '50%', position: 'absolute' }}
                            />
                    </Fragment>
                }

                {(isMobile === false) &&
                    <Container textAlign="center">
                        <Button.Group size='mini' basic>
                            <Button as={ButtonBack} icon="arrow left" />
                            {buttons}
                            <Button as={ButtonNext} icon="arrow right" />
                        </Button.Group>
                    </Container>
                }

            </CarouselProvider>
        )
    }
}

CardCarousel.defaultProps = {
    index: 1,
    isMobile: false,
    items: [<div>First Item</div>,<div>Item 2</div>]
}