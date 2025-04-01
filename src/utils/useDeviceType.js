import { useEffect, useState } from "react";

const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState("desktop");

    useEffect(() => {
        const updateDeviceType = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setDeviceType("mobile");
            } else if (width <= 1024) {
                setDeviceType("tablet");
            } else {
                setDeviceType("desktop");
            }
        };

        updateDeviceType(); // Vérifier dès le premier rendu
        window.addEventListener("resize", updateDeviceType); // Écouter les changements de taille

        return () => {
            window.removeEventListener("resize", updateDeviceType);
        };
    }, []);

    return deviceType;
};

export default useDeviceType;
