import React, { useEffect, useState } from "react";
import d5 from "../../assets/images/d5.jpg";
import vett from "../../assets/images/vett.jpg";
import { Col, Row, Button, Card, ListGroup, Container } from "react-bootstrap";
import VetSlider from "../veterinarian/VetSlider";
import NoDataAvailable from "../common/NoDataAvailable";
import { getVeterinarians } from "../veterinarian/VeterinarianService";

const Home = () => {
  const [vets, setVets] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getVeterinarians()
      .then((vets) => {
        setVets(vets.data.content);
      })
      .catch((error) => {
        setErrorMessage(error.message || "Something went wrong!");
      });
  }, []);

  return (
    <Container className='home-container mt-5'>
      <Row>
        <Col md={6} className='mb-3'>
          <Card>
            <Card.Img
              variant='top'
              src={d5}
              alt='About Us'
              className='hero-image'
            />
            <Card.Body>
              <h2 className='text-info'>Chúng Tôi Là Ai</h2>
              <Card.Title>Chăm Sóc Toàn Diện Cho Những Người Bạn Lông Xù Của Bạn</Card.Title>
              <Card.Text>

                Tại Universal Pet Care, chúng tôi tin rằng mọi thú cưng đều xứng đáng được hưởng
                sự chăm sóc tốt nhất. Đội ngũ chuyên gia tận tâm của chúng tôi luôn sẵn sàng đảm
                bảo sức khỏe và hạnh phúc cho thú cưng của bạn thông qua các dịch vụ thú y toàn diện.

                Với hàng chục năm kinh nghiệm tích lũy, các Bác sĩ Thú y và nhân viên hỗ trợ của chúng
                tôi cam kết cung cấp dịch vụ chăm sóc cá nhân hóa, phù hợp với nhu cầu riêng biệt của
                từng thú cưng.
              </Card.Text>
              <Card.Text>
                Chúng tôi cung cấp đa dạng các loại hình dịch vụ, từ chăm sóc phòng ngừa, kiểm tra sức
                khỏe định kỳ cho đến các quy trình phẫu thuật nâng cao và chăm sóc khẩn cấp. Cơ sở vật
                chất hiện đại của chúng tôi được trang bị công nghệ thú y tiên tiến nhất, cho phép chúng
                tôi cung cấp dịch vụ chất lượng cao với sự chính xác và lòng tận tâm.
              </Card.Text>
              <Button variant='outline-info'> Đội Ngũ Bác Sĩ Của Chúng Tôi</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className='mb-3'>
          <Card className='service-card'>
            <Card.Img
              variant='top'
              src={vett}
              alt='About Us'
              className='hero-image'
            />
            <Card.Body>
              <h2 className='text-info'>Dịch Vụ Của Chúng Tôi</h2>
              <Card.Title>Các Dịch Vụ Cung Cấp</Card.Title>
              <ListGroup className='services-list'>
                <ListGroup.Item>Kiểm Tra Sức Khỏe Thú Y</ListGroup.Item>
                <ListGroup.Item>Phẫu Thuật Khẩn Cấp</ListGroup.Item>
                <ListGroup.Item>Tiêm Phòng Vắc-xin</ListGroup.Item>
                <ListGroup.Item>Chăm Sóc Răng Miệng</ListGroup.Item>
                <ListGroup.Item>Triệt Sản</ListGroup.Item>
                <ListGroup.Item>Và nhiều dịch vụ khác...</ListGroup.Item>
              </ListGroup>
              <Card.Text className='mt-3'>
                Từ kiểm tra sức khỏe định kỳ cho đến phẫu thuật khẩn cấp, toàn
                bộ dịch vụ thú y của chúng tôi đảm bảo sức khỏe thú cưng của bạn
                luôn được chăm sóc tốt nhất.
              </Card.Text>
              <Button variant='outline-info'> Đội Ngũ Bác Sĩ Của Chúng Tôi</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className='card mb-5'>
        <h5>
          Khách hàng nói gì về bác sĩ thú y{" "}
          <span className='text-info'>Pet Care</span>
        </h5>
        <hr />
        {vets.length > 0 ? (
          <VetSlider vets={vets} />
        ) : (
          <NoDataAvailable
            dataType='veterinarians data'
            errorMessage={errorMessage}
          />
        )}
      </div>
    </Container>
  );
};

export default Home;
