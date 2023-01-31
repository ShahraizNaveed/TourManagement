import React from 'react'
import CommonSection from '../shared/CommonSection/CommonSection'
import Newsletter from '../shared/Newsletter/Newsletter'

const About = () => {
  return (
    <>
    <CommonSection title={'About Us'} />
    <section>
        <Newsletter />
    </section>
    </>
  )
}

export default About