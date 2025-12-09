import './Home.css';

export default function Home() {
  // return <h2>Welcome to ServiceConnect</h2>;

  return (
    // <div className="home-container">
    //     <img
    //       src="/team-logo.png"
    //       alt="Team Logo"
    //       className="team-logo"
    //     />

    //     <h1 className="site-title">ServiceConnect</h1>

    //     <p className="tagline">
    //       Connecting users with fast and reliable services — anytime, anywhere.
    //     </p>
    //   </div>

    <div className='landing-container'>
      <div className='logo-section'>
        {/* <img src="/team-logo.png" alt="ServiceConnect Logo" className="logo" /> */}
        <h1 className='site-title'>SERVICECONNECT</h1>
      </div>

      <p className='tagline'>
        Connecting People • Connecting Services • Empowering Communities
      </p>

      <div className='cta-buttons'>
        <a href='/services' className='btn-main'>
          Explore Services
        </a>
        <a href='/login' className='btn-outline'>
          Login
        </a>
      </div>
    </div>
  );
}
