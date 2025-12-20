import React, { useState, useEffect } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Form, Row, Col, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import AlertMessage from "../common/AlertMessage";
import { findAvailableVeterinarians } from "./VeterinarianService";
import { dateTimeFormatter } from "../utils/utilities";
import { getAllSpecializations } from "./VeterinarianService";

const VeterinarianSearch = ({ onSearchResult }) => {
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    date: null,
    time: null,
    specialization: "",
  });
  const [showDateTime, setShowDateTime] = useState(false);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  const handleInputchange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      date: date,
    }));
  };

  const handleTimeChange = (time) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      time: time,
    }));
  };

  const handleDateTimeToggle = (e) => {
    const isChecked = e.target.checked;
    setShowDateTime(isChecked);
    if (isChecked) {
      setSearchQuery({ ...searchQuery, date: null, time: null });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const { date, time, specialization } = searchQuery;

    let searchParams = { specialization };

    if (date && time) {
      const { formattedDate, formattedTime } = dateTimeFormatter(date, time);
      searchParams.date = formattedDate;
      searchParams.time = formattedTime;
    }

    try {
      const response = await findAvailableVeterinarians(searchParams);
      onSearchResult(response.data);
      setShowErrorAlert(false);
    } catch (error) {
      console.log("Từ khóa tìm kiếm : " + error);
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    getAllSpecializations()
      .then((data) => {
        setSpecializations(data.data || data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  const handleClearSearch = () => {
    setSearchQuery({
      date: null,
      time: null,
      specialization: "",
    });
    setShowDateTime(false);
    onSearchResult(null);
  };

  return (
    <section className='stickyFormContainer'>
      <h3>Tìm bác sĩ thú y</h3>
      <Form onSubmit={handleSearch}>
        <Form.Group>
          <Form.Label>Chuyên khoa</Form.Label>
          <Form.Control
            as='select'
            name='specialization'
            value={searchQuery.specialization}
            onChange={handleInputchange}>
            <option value=''>Tất cả chuyên khoa</option>
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <fieldset>
          <Row className='mb-3'>
            <Col>
              <Form.Group className='mb-3 mt-3'>
                <Form.Check
                  type='checkbox'
                  label='Ngày và giờ khả dụng'
                  checked={showDateTime}
                  onChange={handleDateTimeToggle}
                />
              </Form.Group>
              {showDateTime && (
                <React.Fragment>
                  <legend>Ngày và giờ</legend>
                  <Form.Group className='mb-3 d-flex align-items-center'>
                    <Form.Label className='searchText me-3' style={{ width: '50px' }}>Ngày</Form.Label>
                    <DatePicker
                      selected={searchQuery.date}
                      onChange={handleDateChange}
                      dateFormat='yyyy-MM-dd'
                      minDate={new Date()}
                      className='form-control w-100'
                      placeholderText='Chọn ngày'
                    />
                  </Form.Group>
                  <Form.Group className='mb-3 d-flex align-items-center'>
                    <Form.Label className='searchText me-3' style={{ width: '50px' }}>Giờ</Form.Label>
                    <DatePicker
                      selected={searchQuery.time}
                      onChange={handleTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeFormat='HH:mm'
                      timeIntervals={30}
                      timeCaption='Giờ'
                      dateFormat='HH:mm'
                      className='form-control w-100'
                      placeholderText='Chọn giờ'
                      required
                      minTime={
                        searchQuery.date &&
                          new Date(searchQuery.date).toDateString() === new Date().toDateString()
                          ? (() => {
                            const now = new Date();
                            const eightAM = new Date();
                            eightAM.setHours(8, 0, 0, 0);
                            return now > eightAM ? now : eightAM;
                          })()
                          : (() => {
                            const d = new Date();
                            d.setHours(8, 0, 0, 0);
                            return d;
                          })()
                      }
                      maxTime={(() => {
                        const d = new Date();
                        d.setHours(18, 0, 0, 0);
                        return d;
                      })()}
                    />
                  </Form.Group>
                </React.Fragment>
              )}
            </Col>
          </Row>
        </fieldset>

        <div className='d-flex justify-content-center mb-4'>
          <Button type='submit' variant='outline-primary'>
            Tìm kiếm
          </Button>
          <div className='mx-2'>
            <Button
              type='button'
              variant='outline-info'
              onClick={handleClearSearch}>
              Xóa tìm kiếm
            </Button>
          </div>
        </div>
      </Form>
      <div>
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
      </div>
    </section>
  );
};

export default VeterinarianSearch;
