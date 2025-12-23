import React from 'react'
import { Carousel, Container, Col, Row, Card } from "react-bootstrap";
import RatingStars from '../rating/RatingStars';
import { Link } from 'react-router-dom';
import placeholderImage from "../../assets/images/placeholder.jpg";

const VetSlider = ({ vets }) => {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9193/api/v1";

  return (
    <main>
      <Carousel interval={5000} indicators={true} controls={true}>
        {vets &&
          vets.map((vet, index) => (
            <Carousel.Item key={index}>
              <Row className='align-items-center'>
                <Col xs={12} md={4} className='text-center'>
                  <Card.Img
                    src={
                      vet.photoId
                        ? `${baseURL}/photos/photo/${vet.photoId}/photo`
                        : vet.photo
                          ? `data:image/png;base64,${vet.photo}`
                          : placeholderImage
                    }
                    onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                    alt={"photo"}
                    style={{
                      maxWidth: "400px",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                </Col>
                <Col xs={12} md={8}>
                  <div>
                    <RatingStars rating={vet.averageRating} />
                  </div>
                  <div>
                    <p className='text-success'>
                      Bác sĩ {`${vet.firstName} ${vet.lastName}`}
                    </p>
                  </div>
                  <p>{vet.specialization}</p>
                  <p>
                    <span className='text-info'>
                      Bác sĩ {`${vet.firstName} ${vet.lastName}`} là chuyên gia{" "}
                      {vet.specialization}.
                    </span>
                    Chúng tôi luôn cố gắng mang đến những thông tin chính xác và
                    hữu ích nhất về chăm sóc sức khỏe cho thú cưng của bạn. Đội
                    ngũ chuyên gia của chúng tôi cam kết cung cấp dịch vụ khám
                    chữa bệnh chất lượng cao, giúp thú cưng của bạn khỏe mạnh và
                    hạnh phúc.
                  </p>
                  <p>
                    <Link
                      className='me-3 link-2'
                      to={`/vet-reviews/${vet.id}/veterinarian`}>
                      Khách hàng nói gì về
                    </Link>
                    Bác sĩ {`${vet.firstName} ${vet.lastName}`} ?
                  </p>
                  <p>
                    <Link className='me-3' to={"/doctors"}>
                      Gặp Gỡ Toàn Bộ Bác Sĩ Thú Y
                    </Link>
                  </p>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
      </Carousel>
    </main>
  );
}

export default VetSlider
