import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import placeholder from "../../assets/images/placeholder.jpg";

const UserImage = ({ userId, userPhoto, photoId, altText = "User photo" }) => {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9193/api/v1";

  // Logic: 
  // 1. If photoId exists -> Use API URL (Lazy load) -> Optimized for Lists
  // 2. If userPhoto (base64) exists -> Use Base64 (Legacy/Detail view)
  // 3. Else -> Placeholder

  let imageSrc = placeholder;

  if (photoId) {
    imageSrc = `${baseURL}/photos/photo/${photoId}/photo`;
  } else if (userPhoto) {
    imageSrc = `data:image/png;base64,${userPhoto}`;
  }

  return (
    <Fragment>
      <Card.Img
        src={imageSrc}
        className='user-image'
        alt={altText}
        onError={(e) => { e.target.onerror = null; e.target.src = placeholder; }}
      />
    </Fragment>
  );
};

export default UserImage;
