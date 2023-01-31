import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './booking.css'
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap'
import { AuthContext } from '../../context/authContext'
import { BASE_URL } from '../../utils/config'

const Booking = ({ tour, avgRating }) => {
    const { price, reviews, title } = tour
    const navigate = useNavigate()

    const {user} = useContext(AuthContext)

    const [booking, setBooking] = useState({
        userId: user && user._id,
        email: user && user.email,
        tourName: title,
        fullName: '',
        phone: '',
        guestSize: 1,
        bookAt: ''
    })

    const handleChange = (e) => {
        setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const serviceFee = 10
    const totalCost = Number(price) * Number(booking.guestSize) + Number(serviceFee)


    //send data to server
    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log(booking);

        try {
            if(!user || user === undefined || user === null) {
                return alert('Please sign in')
            }

            const res = await fetch(`${BASE_URL}/booking`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(booking)
            })

            const result = await res.json()

            if(!res.ok) {
                return alert(result.message)
            }
            navigate('/thank-you')

        } catch (err) {
            alert(err.message)
        }
    }



    return (
        <div className="booking">
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>${price} <span>/per person</span></h3>

                <span className="tour__ratinf d-flex align-items-center">
                    <i className='ri-star-fill'></i>
                    {avgRating === 0 ? null : avgRating} ({reviews?.length})
                </span>
            </div>

            {/* ========== Booking Form Start =============== */}
            <div className="booking__form">
                <h5>Information</h5>
                <Form className='booking__info-form' onSubmit={handleSubmit}>
                    <FormGroup>
                        <input
                            type="text"
                            placeholder='Full Name'
                            id='fullName'
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <input
                            type="number"
                            placeholder='Phone'
                            id='phone'
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup className='d-flex align-items-center gap-3'>
                        <input
                            type="date"
                            placeholder=''
                            id='bookAt'
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            placeholder='Guest'
                            id='guestSize'
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                </Form>
            </div>
            {/* ========== Booking Form End =============== */}

            {/* ========== Booking Bottom  =============== */}
            <div className="booking__bottom">
                <ListGroup>
                    <ListGroupItem className='border-0 px-0'>
                        <h5 className='d-flex align-items-center gap-1'>
                            ${price} <i className='ri-close-line'></i> 1 person
                        </h5>
                        <span>${price}</span>
                    </ListGroupItem>

                    <ListGroupItem className='border-0 px-0'>
                        <h5>Service Charges</h5>
                        <span>${serviceFee}</span>
                    </ListGroupItem>

                    <ListGroupItem className='border-0 px-0 total'>
                        <h5>Total</h5>
                        <span>${totalCost}</span>
                    </ListGroupItem>
                </ListGroup>

                <Button className='btn primary__btn w-100 mt-4' onClick={handleSubmit}>Book Now</Button>
            </div>

        </div>
    )
}

export default Booking