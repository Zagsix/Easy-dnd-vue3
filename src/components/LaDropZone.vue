<template>
    <la-drop @drop="drop" accepts-type="number" :accepts-data="accept">
        <slot name="default"></slot>
        <div class="dropped">
            <div v-for="n in numbers">Dropped : {{ n }}</div>
        </div>
    </la-drop>
</template>

<script>
import LaDrop from "./LaDrop.vue";
import {laMove} from "./utils/laMove";

export default {
    name: "LaDropZone",
    components: {LaDrop},
    props: {
        accept: {
            type: Function,
            default(data) {
                return true;
            }
        }
    },
    data() {
        return {
            numbers: []
        }
    },
    methods: {
        drop() {
            console.log('Drop');
            this.numbers.push(laMove.data);
        },
        dropImage() {
            return this.$refs['shadow'];
        }
    }
}
</script>

<style scoped>

</style>