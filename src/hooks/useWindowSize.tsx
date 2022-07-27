import { useState, useEffect } from "react";

export enum DeviceTypes {
  MOBILE,
  TABLET,
  DESKTOP
}

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0
  });
  const [deviceType, setDeviceType] = useState<DeviceTypes>();

  useEffect(() => {
    if(typeof window !== "undefined") {
      const handleResize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        });

        // Defines the type of device based on width.
        switch(true) {
          case window.innerWidth < 768:
            setDeviceType(DeviceTypes.MOBILE);
            break;
          case window.innerWidth < 1100:
            setDeviceType(DeviceTypes.TABLET);
            break;
          default:
            setDeviceType(DeviceTypes.DESKTOP);
        }
      };

      window.addEventListener("resize", handleResize);
      // Get the first value of the size.
      handleResize();

      // Free resources.
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return {size: size, deviceType: deviceType} as const;
};

export default useWindowSize;