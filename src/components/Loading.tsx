import React, {ReactNode} from 'react';
import {Player} from "@lottiefiles/react-lottie-player";
import animatedLoad from "../assets/loading.json";

export interface ILoadingProps {
  className?: string
}

const Loading: React.FunctionComponent<ILoadingProps> = ({className = ''}) => {
  return (
    <div className={`loading ${className}`}>
      <div className="load-animation">
        <Player id="load-lottie"
                autoplay
                loop
                src={animatedLoad}
        />
      </div>
    </div>
  );
}

export default Loading;