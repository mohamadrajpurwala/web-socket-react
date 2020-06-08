import LiveVisitors from "../components/LiveVisitors";
import RoomChat from "../components/RoomChat";
import PublicChat from "../components/PublicChat";


export default [
    {
        path: "/", exact: true, component: RoomChat
    },
    {
        path: "/LiveVisitors", component: LiveVisitors
    },
    {
        path: "/publicChat", component: PublicChat
    }
];