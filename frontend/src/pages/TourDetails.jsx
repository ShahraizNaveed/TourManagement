import React, { useRef, useState, useEffect, useContext } from 'react'
import '../styles/tour-detail.css'
import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { useParams } from 'react-router-dom'
import tourData from '../assets/data/tours'
import calculateAvgRating from '../utils/avgRating'
import avatar from '../assets/images/avatar.jpg'
import Booking from '../components/Booking/Booking'
import Newsletter from '../shared/Newsletter/Newsletter'
import useFetch from '../hooks/useFetch'
import { BASE_URL } from '../utils/config'

import { AuthContext } from '../context/authContext'


const TourDetails = () => {

  const { id } = useParams()
  const reviewMessageRef = useRef('')
  const [tourRating, setTourRating] = useState(null)
  const { user } = useContext(AuthContext)

  // fetch data from database
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`)

  const { photo, title, city, reviews, desc, price, address, distance, maxGroupSize } = tour

  const { totalRating, avgRating } = calculateAvgRating(reviews)

  // Format the date
  const option = { day: 'numeric', month: 'long', year: 'numeric' }

  //Submit request to server
  const handleSubmit = async (e) => {
    e.preventDefault()
    const reviewText = reviewMessageRef.current.value


    try {
      if (!user || user === undefined || user === null) {
        alert('Please sign in')
      }

      const reviewObj = {
        username: user?.username,
        reviewText,
        rating: tourRating
      }

      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reviewObj)
      })

      const result = await res.json()
      if (!res.ok) {
        return alert(result.message)
      }

      alert(result.message)
    } catch (err) {
      alert(err.message)

    }

    //Later we will call api

    // alert(`${reviewText}, ${tourRating} `)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tour])

  return (
    <>
      <section>
        <Container>
          {loading && <h4 className="text-center pt-5">Loading......</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {
            !loading &&
            !error &&
            <Row>
              <Col lg='8'>
                <div className="tour__content">
                  <img src={photo} alt="" />

                  <div className="tour__info">
                    <h2>{title}</h2>

                    <div className='d-flex align-items-center gap-5'>
                      <span className="tour__ratinf d-flex align-items-center gap-1">
                        <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i> {avgRating === 0 ? null : avgRating}
                        {totalRating === 0 ? 'Not rated' : <span>({reviews?.length})</span>}
                      </span>

                      <span>
                        <i className='ri-map-pin-fill'></i> {address}
                      </span>
                    </div>

                    <div className="tour__extra-details">
                      <span><i className='ri-map-pin-2-line'></i> {city}</span>
                      <span><i className='ri-money-dollar-circle-line'></i> ${price} /per person</span>
                      <span><i className='ri-map-pin-time-line'></i> {distance} k/m</span>
                      <span><i className='ri-group-line'></i> {maxGroupSize} people</span>
                    </div>

                    <h5>Description</h5>
                    <p>{desc}</p>
                  </div>


                  {/* ========== Tour Review Section Start ========  */}
                  <div className="tour__reviews mt-4">
                    <h4>Reviews ({reviews?.length} reviews)</h4>

                    <Form onSubmit={handleSubmit}>
                      <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                        <span onClick={() => setTourRating(1)}>
                          1 <i className='ri-star-s-fill'></i>
                        </span>

                        <span onClick={() => setTourRating(2)}>
                          2 <i className='ri-star-s-fill'></i>
                        </span>

                        <span onClick={() => setTourRating(3)}>
                          3 <i className='ri-star-s-fill'></i>
                        </span>

                        <span onClick={() => setTourRating(4)}>
                          4 <i className='ri-star-s-fill'></i>
                        </span>

                        <span onClick={() => setTourRating(5)}>
                          5 <i className='ri-star-s-fill'></i>
                        </span>

                      </div>

                      <div className="review__input">
                        <input type="text" placeholder='Share your thoughts' required ref={reviewMessageRef} />
                        <button className="btn primary__btn text-white" type='submit'>
                          Submit
                        </button>
                      </div>
                    </Form>

                    <ListGroup className='user__reviews'>
                      {
                        reviews?.map((review) => (
                          <div className="review__item">
                            <img src={avatar} alt="" />

                            <div className="w-100">
                              <div className="d-flex align-items-center justify-content-between">
                                <div>
                                  <h5>{user?.username}</h5>
                                  <p>{new Date(review.createdAt).toLocaleDateString("en-US", option)}</p>
                                </div>

                                <span className='d-flex align-items-center'>
                                  {review.rating} <i className='ri-star-fill'></i>
                                </span>
                              </div>

                              <h6>{review.reviewText}</h6>
                            </div>
                          </div>
                        ))
                      }
                    </ListGroup>
                  </div>
                  {/* ========== Tour Review Section End ========  */}

                </div>
              </Col>

              <Col lg='4'>
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          }
        </Container>
      </section>

      <Newsletter />
    </>
  )
}

export default TourDetails