import { motion } from 'framer-motion';
import Banner from './Banner/Banner';
import Contact from './Contact/Contact';
import FAQ from './FAQ/FAQ';
import TopScholarship from './TopScholarship/TopScholarship';

const Home = () => {
  // 1. Define the animation behavior
  // "hidden": Initial state (invisible, slightly down)
  // "visible": Final state (fully visible, normal position)
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    // 'overflow-x-hidden' prevents horizontal scrollbars during animation
    <section className='overflow-hidden'>
      {/* Banner: Animates immediately on page load */}
      <motion.div
        id='homeBanner'
        variants={fadeInUp}
        initial='hidden'
        animate='visible'
      >
        <Banner />
      </motion.div>

      {/* Top Scholarship: Animates when user scrolls to it */}
      <motion.div
        id='topScholarships'
        variants={fadeInUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }} // 'once: true' means it won't animate again when scrolling up
        className='my-12' // Add spacing between sections
      >
        <TopScholarship />
      </motion.div>

      {/* Contact Section */}
      <motion.div
        id='contact'
        variants={fadeInUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        className='my-12'
      >
        <Contact />
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        id='faq'
        variants={fadeInUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        className='my-12'
      >
        <FAQ />
      </motion.div>
    </section>
  );
};

export default Home;
