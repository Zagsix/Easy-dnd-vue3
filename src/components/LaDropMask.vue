<template>
    <component :is="tag" v-bind="$attrs">
        <slot></slot>
    </component>
</template>

<script>
import DragAwareMixin from "./mixins/DragAwareMixin";
import {laMove} from "./utils/laMove";

export default {
    name: "LaDropMask",
    mixins: [DragAwareMixin],
    data() {
        return {
            isDropMask: true
        }
    },
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },

    mounted() {
        let el = this.$el;
        el.addEventListener('la-move', this.onMouseMove);

    },
    methods: {
        onMouseMove(e) {
            laMove.mouseMove(e, this);
        },
        createDragImage() {
            return 'source';
        }
    }
}
</script>

<style scoped>

</style>