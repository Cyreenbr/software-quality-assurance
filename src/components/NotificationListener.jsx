import { SocketNames } from "../utils/socketNames";
import useNotificationSocket from "../utils/useNotificationSocket";

const NotificationListener = () => {
    useNotificationSocket({
        socketEvents: [
            SocketNames.newNotification,
            SocketNames.sendNotificationToUser,
            SocketNames.notificationError,
        ],
    });

    return null; // Composant invisible, uniquement à effet secondaire
};

export default NotificationListener;
