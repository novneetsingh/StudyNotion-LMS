import React, { useEffect, useState } from "react";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";

function RatingStars({ Review_Count, Star_Size }) {
  // State to track the count of full, half, and empty stars
  const [starCount, setStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  });

  // Update starCount when Review_Count changes
  useEffect(() => {
    // Calculate the number of whole stars (full)
    const wholeStars = Math.floor(Review_Count) || 0;

    // Update starCount based on Review_Count
    setStarCount({
      full: wholeStars,
      // If Review_Count is not an integer, add one half star
      half: Number.isInteger(Review_Count) ? 0 : 1,
      // Calculate the number of empty stars based on wholeStars
      empty: Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars,
    });
  }, [Review_Count]); // Re-run effect when Review_Count changes

  return (
    // Render stars based on starCount
    <div className="flex gap-1 text-yellow-100">
      {/* Render full stars */}
      {[...new Array(starCount.full)].map((_, i) => {
        return <TiStarFullOutline key={i} size={Star_Size || 20} />;
      })}
      {/* Render half stars */}
      {[...new Array(starCount.half)].map((_, i) => {
        return <TiStarHalfOutline key={i} size={Star_Size || 20} />;
      })}
      {/* Render empty stars */}
      {[...new Array(starCount.empty)].map((_, i) => {
        return <TiStarOutline key={i} size={Star_Size || 20} />;
      })}
    </div>
  );
}

export default RatingStars;
