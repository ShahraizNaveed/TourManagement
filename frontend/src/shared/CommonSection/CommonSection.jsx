import React from 'react'
import './common-section.css'
import { Container, Row, Col } from 'reactstrap'

const CommonSection = ({ title }) => {
    return (
        <section className="common__section">
            <Container>
                <Row>
                    <Col lg='12'>
                        <h2>{title}</h2>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default CommonSection