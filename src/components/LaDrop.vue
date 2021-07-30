<template>
    <component :is="tag" v-bind="$attrs" :class="cssClasses" :style="cssStyle">
        <slot></slot>
        <div class="__drag-image" v-if="showDragImage" ref="drag-image">
            <slot name="drag-image" :type="dragType" :data="dragData"></slot>
        </div>
    </component>
</template>

<script>
import DropMixin from "./mixins/DropMixin";
import DragAwareMixin from "./mixins/DragAwareMixin";

export default {
    name: "LaDrop",
    mixins: [DropMixin,DragAwareMixin],
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    },
    computed: {
        showDragImage() {
            return this.dragInProgress && this.typeAllowed && this.$scopedSlots['drag-image'];
        }
    }
}
</script>

<style scoped>

</style>