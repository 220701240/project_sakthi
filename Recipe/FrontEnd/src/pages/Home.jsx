import React from "react";
import { Carousel } from "react-bootstrap"; // Import Bootstrap Carousel
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

const Home = () => {
  return (
    <div>
      {/* Bootstrap Carousel with Auto-Slide Enabled */}
      <Carousel className="w-100" controls={true} indicators={true} pause={false}>
        <Carousel.Item interval={3000}> {/* Slide changes every 3 seconds */}
          <img
            className="d-block w-100"
            src="https://images.pexels.com/photos/30792615/pexels-photo-30792615/free-photo-of-vibrant-fruit-tart-with-fresh-berries.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Vibrant Fruit Tart"
            style={{ height: "600px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"black" ,fontStyle:"italic"}}>Delicious Fruit Tart</h3>
            <h5 style={{color:"black" ,fontStyle:"italic"}}>Enjoy a vibrant and fresh fruit tart filled with berries.</h5>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={3000}> {/* Slide changes every 3 seconds */}
          <img
            className="d-block w-100"
            src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg"
            alt="Pasta Dish"
            style={{ height: "600px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"black" ,fontStyle:"italic"}}>Homemade Pasta</h3>
            <p style={{color:"black" ,fontStyle:"italic"}}>Indulge in a delicious homemade pasta recipe.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item interval={3000}> {/* Slide changes every 3 seconds */}
          <img
            className="d-block w-100"
            src="https://images.pexels.com/photos/4108723/pexels-photo-4108723.jpeg"
            alt="Cupcakes"
            style={{ height: "600px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h3 style={{color:"white" ,fontStyle:"italic"}}>Chocolate Cupcakes</h3>
            <h5 style={{color:"white" ,fontStyle:"italic"}}>Soft and fluffy chocolate cupcakes with a creamy topping.</h5>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Home;
