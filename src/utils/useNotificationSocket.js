import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "./socket";
import { SocketNames } from "./socketNames";

export default function useNotificationSocket({ onNotification }) {
    const role = useSelector((state) => state.auth?.role);
    const userId = useSelector((state) => state.auth?.user?.id);

    useEffect(() => {
        if (!userId || !role) return;

        socket.emit(SocketNames.registerSocketUser, { userId, role });

        const handleNotification = (data) => {
            if (onNotification) onNotification(data);

            const toastType = {
                reminder: toast.info,
                warning: toast.warn,
                success: toast.success,
                urgent: toast.error,
                info: toast.info,
            }[data.type] || toast.info;

            if (data.message) {
                toastType(data.message);
            }
        };

        socket.on(SocketNames.newNotification, handleNotification);
        socket.on(SocketNames.sendNotificationToUser, handleNotification);
        socket.on(SocketNames.notificationError, handleNotification);

        return () => {
            socket.off(SocketNames.newNotification, handleNotification);
            socket.off(SocketNames.sendNotificationToUser, handleNotification);
            socket.off(SocketNames.notificationError, handleNotification);
        };
    }, [userId, role, onNotification]);
}
