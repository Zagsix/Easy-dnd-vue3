import {laMove} from "../utils/laMove";

export default {
    computed: {
        dragInProgress() {
            return laMove.inProgress;
        },

        dragData() {
            return laMove.data;
        },

        dragType() {
            return laMove.type;
        },

        dragPosition() {
            return laMove.position;
        },

        dragSource() {
            return laMove.source;
        },

        dragTop() {
            return laMove.top;
        },
    }

}