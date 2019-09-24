<template lang="pug">
  .muninn-range-slider
    .subheader {{label}}
    v-layout(row)
      v-text-field(
        type="number"
        :disabled="disabled"
        :value="value[0]"
        :min="min"
        :max="max"
        @input="$emit('input', [$event, value[1]])"
      )
      v-flex.mh-1
        v-range-slider(
          :value="value"
          :disabled="disabled"
          :min="min"
          :max="max"
          @input="$emit('input', $event)"
        )
      v-text-field(
        type="number"
        :disabled="disabled"
        :value="value[1]"
        :min="min"
        :max="max"
        @input="$emit('input', [value[0], $event])"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class RangeSlider extends Vue {
  @Prop({ required: true, type: Array }) private value!: [number, number];
  @Prop({ required: true, type: Number }) private min!: number;
  @Prop({ required: true, type: Number }) private max!: number;
  @Prop({ required: true, type: String }) private label!: string;
  @Prop({ type: Boolean }) private disabled?: boolean;
}
</script>
