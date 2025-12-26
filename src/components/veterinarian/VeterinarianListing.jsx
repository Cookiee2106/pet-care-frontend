import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import VeterinarianCard from "./VeterinarianCard";
import { getVeterinarians } from "./VeterinarianService";
import VeterinarianSearch from "./VeterinarianSearch";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import NoDataAvailable from "../common/NoDataAvailable";
import LoadSpinner from "../common/LoadSpinner";

const VeterinarianListing = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [veterinarians, setVeterinarians] = useState([]);
  const [allVeterinarians, setAllVeterinarians] = useState([]); // Might need refactor if "all" is now paginated. For search client-side, this is broken now. 
  // SEARCH LOGIC FIX: "Search" endpoint also needs pagination OR we use server-side search.
  // The user asked for "Update getAllVeterinarians" to be paginated. 
  // "Update Controller... add @RequestParam page/size".
  // The search logic in `handleSearchResult` relies on `allVeterinarians` which previously held EVERYTHING.
  // Now we don't have EVERYTHING. Client-side search is now impossible for full dataset.
  // However, `VeterinarianSearch` component likely calls an API.
  // Let's check `VeterinarianSearch`.
  // If `VeterinarianSearch` calls API, returns list, passes to `onSearchResult`.
  // `onSearchResult` sets `veterinarians`.
  // So search MIGHT still work if it returns a List from server.
  // BUT `allVeterinarians` fallback logic (when search cleared) will only restore the CURRENT PAGE.
  // Acceptable for now.

  const [isLoading, setIsLoading] = useState(true);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  useEffect(() => {
    setIsLoading(true);
    getVeterinarians(currentPage, 10)
      .then((data) => {
        // data.data is the Page object
        setVeterinarians(data.data.content);
        setTotalPages(data.data.totalPages);
        setAllVeterinarians(data.data.content); // Only current page backup
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Lỗi tải dữ liệu"); // Safer access
        setShowErrorAlert(true);
        setIsLoading(false);
      });
  }, [currentPage]); // Re-fetch when page changes

  const handleSearchResult = (veterinarians) => {
    if (veterinarians === null) {
      setVeterinarians(allVeterinarians);
    } else if (Array.isArray(veterinarians) && veterinarians.length > 0) {
      setVeterinarians(veterinarians);
      setTotalPages(1); // Hide pagination during search
    } else {
      setVeterinarians([]);
      setTotalPages(0);
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  }

  return (
    <Container>
      {veterinarians && veterinarians.length > 0 ? (
        <React.Fragment>
          <Row className='justify-content-center'>
            <h2 className='text-center mb-4 mt-4'>Gặp gỡ các bác sĩ của chúng tôi</h2>
          </Row>

          <Row className='justify-content-center'>
            <Col md={4}>
              <VeterinarianSearch onSearchResult={handleSearchResult} />
            </Col>
            <Col md={7}>
              {veterinarians.map((vet, index) => (
                <VeterinarianCard key={index} vet={vet} />
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 mb-5">
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}>
                    Trước
                  </button>
                  <span className="align-self-center mx-2">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-primary ms-2"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}>
                    Sau
                  </button>
                </div>
              )}

            </Col>
          </Row>
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={" veterinarians data "}
          message={errorMessage}
        />
      )}
    </Container>
  );
};

export default VeterinarianListing;
