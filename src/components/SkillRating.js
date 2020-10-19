import React from 'react';
import ReactStars from "react-rating-stars-component";
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { FiStar } from 'react-icons/fi'

export default function SkillRating(props) {
    return (
        <ReactStars
            count={5}
            value={props.ratingValue}
            size={35}
            isHalf={true}
            edit={false}
            emptyIcon={<FiStar />}
            halfIcon={<FaStarHalfAlt />}
            fullIcon={<FaStar />}
            activeColor="#1abc9c"
        />
    );
}
