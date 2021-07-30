<template>
    <component :is="tag" v-bind="$attrs">
        <slot></slot>
        <div class="__drag-image" ref="drag-image">
            <slot name="drag-image"></slot>
        </div>
    </component>
</template>

<script>
import DragMixin from './mixins/DragMixin'
import DragAwareMixin from './mixins/DragAwareMixin'

export default {
    name: "LaDrag",
    mixins: [DragMixin,DragAwareMixin],
    props: {
        tag: {
            type: String,
            default: 'div'
        }
    }

}
</script>

<style scoped>

</style>