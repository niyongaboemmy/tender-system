import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ExamCountDown = (props: {
  datetime: Date;
  minutes: number;
  onTimeOut: () => void;
}) => {
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const TimerItem = (
    title: string,
    value: number,
    edge: "start" | "end" | null
  ) => {
    return (
      <div
        className={`flex flex-col items-center justify-center px-2 py-1 cursor-pointer hover:text-primary-800 group ${
          edge === null ? "border-r" : ""
        } border-t border-b ${
          edge === "start" ? "border-l border-r rounded-l-md" : ""
        } ${edge === "end" ? "border-r rounded-r-md" : ""} text-center`}
      >
        <div
          className={`font-bold text-lg ${
            value === 0 ? "text-gray-400" : ""
          } group-hover:text-primary-800`}
        >
          {value}
        </div>
        <div
          className={`text-xs font-normal -mt-1 ${
            value === 0 ? "text-gray-400" : "text-gray-500"
          } group-hover:text-primary-800`}
        >
          {title}
        </div>
      </div>
    );
  };
  useEffect(() => {
    // Set the date we're counting down to
    var countDownDate = props.datetime.getTime() + props.minutes * 60000;

    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        // setCurrentCounter("EXPIRED");
        props.onTimeOut();
      }
    }, 1000);
  });

  return (
    <div>
      {seconds < 0 ? (
        <div className="text-2xl font-bold text-gray-400 animate__animated animate__zoomIn">
          TIME IS UP
        </div>
      ) : days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? (
        <div>
          <AiOutlineLoading3Quarters className="text-3xl text-yellow-500 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-row items-center truncate animate__animated animate__fadeIn animate__slow">
          {TimerItem("Days", days, "start")}
          {TimerItem("Hours", hours, null)}
          {TimerItem("Mins", minutes, null)}
          {TimerItem("Secs", seconds, "end")}
        </div>
      )}
    </div>
  );
};

export default ExamCountDown;
