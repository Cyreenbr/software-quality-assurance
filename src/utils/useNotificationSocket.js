import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "./socket";
import { SocketNames } from "./socketNames";

export default function useNotificationSocket({
    onNotification,
    socketEvents = [],
    registerEvent = SocketNames.registerSocketUser,
    activateToast = true,
}) {
    const role = useSelector((state) => state.auth?.role);
    const userId = useSelector((state) => state.auth?.user?.id);

    // Toast types mapping memoized once
    const toastTypeMap = useMemo(() => ({
        reminder: toast.info,
        warning: toast.warn,
        success: toast.success,
        urgent: toast.error,
        info: toast.info,
    }), []);

    // Memoized handler to ensure stable reference
    const handleNotification = useCallback((data) => {
        if (onNotification) onNotification(data);

        if (activateToast && data?.message) {
            const toastFn = toastTypeMap[data?.type] || toast.info;
            toastFn(data.message);
        }
    }, [onNotification, activateToast, toastTypeMap]);

    useEffect(() => {
        if (!userId || !role) return;

        // Register user to socket server
        socket.emit(registerEvent, { userId, role });

        // Register socket listeners
        socketEvents.forEach((eventName) => {
            socket.on(eventName, handleNotification);
        });

        // Clean up on unmount
        return () => {
            socketEvents.forEach((eventName) => {
                socket.off(eventName, handleNotification);
            });
        };
    }, [userId, role, socketEvents, registerEvent, handleNotification]);
}
