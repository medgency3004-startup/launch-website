export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-left">
          <h3>MEDGENCY</h3>
          <p>Life-saving connections, one click away.</p>
        </div>
  
        <div className="footer-links">
          <div>
            <h4>Useful links</h4>
            <a>Home</a>
            <a>Hospital</a>
            <a className="danger">Emergency</a>
            <a>About Us</a>
          </div>
  
          <div>
            <h4>Services</h4>
            <a>Blood Donation</a>
            <a>Scheduled Delivery</a>
            <a className="danger">Emergency SOS</a>
            <a>24/7 Support</a>
          </div>
        </div>
      </footer>
    );
  }
  