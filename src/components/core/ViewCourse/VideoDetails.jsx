import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "video-react/dist/video-react.css";
import { Player, BigPlayButton } from "video-react";

const VideoDetails = () => {
  const { lectureId } = useParams(); // Get lectureId from URL parameters
  const { courseContent } = useSelector((state) => state.viewCourse); // Get course content from Redux state
  const [videoData, setVideoData] = useState(null); // State to hold the video data
  const playerRef = useRef(null); // Ref for the video player

  useEffect(() => {
    // Check if courseContent is available and not empty
    if (courseContent && courseContent.length > 0) {
      // Find the lecture based on the lectureId
      const lecture = courseContent.find(
        (lecture) => lecture._id === lectureId
      );
      if (lecture) {
        // Update the video data state with the found lecture
        setVideoData(lecture);
      } else {
        // Log an error if lectureId doesn't match any lecture
        console.error(`Lecture with ID ${lectureId} not found`);
      }
    } else {
      // Log an error if courseContent is empty or undefined
      console.error("Course content is empty or undefined");
    }
  }, [lectureId, courseContent]); // Dependency array to re-run effect on lectureId or courseContent change

  // Return a loading message if courseContent is not yet available
  if (!courseContent || courseContent.length === 0) {
    return <p>Loading course content...</p>;
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {videoData ? (
        // Render the video player if videoData is available
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          src={videoData.videoUrl}
        >
          <BigPlayButton position="center" />
        </Player>
      ) : (
        // Show a loading message while videoData is being fetched
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VideoDetails;
