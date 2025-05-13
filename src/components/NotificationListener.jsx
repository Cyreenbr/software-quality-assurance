import useNotificationSocket from "../utils/useNotificationSocket";

const NotificationListener = () => {
    // Pas de gestion locale du state ici, uniquement les toasts
    useNotificationSocket({});
    return null;
};

export default NotificationListener;