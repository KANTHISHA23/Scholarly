import { Link } from "react-router";
import BannerImg from "../../../assets/banner-bg.jpg";

const Banner = () => {
  return (
    <div
      className='hero min-h-[80vh]'
      style={{
        backgroundImage: `url(${BannerImg})`,
      }}
    >
      <div className='hero-overlay bg-gradient-to-b from-black/10 to-purple-900/40'></div>
      <div className='hero-content text-neutral-content text-center z-10'>
        <div className='max-w-3xl'>
          <h1 className='mb-5 text-5xl font-bold leading-14'>
            Fuel Your Engineering Dreams. <br /> Find the Best BTech
            Scholarships Today.
          </h1>
          <p className='mb-5 text-lg text-accent-content'>
            Empowering Indian BTech students with a unified platform for
            AICTE-approved schemes, Private Corporate Grants, and
            College-specific Financial Aid. Your one-stop destination for
            funding your engineering journey..
          </p>
          <Link to={'/scholarships'} className='btn btn-primary'>
            Explore Schemes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
