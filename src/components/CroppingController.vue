<template lang="pug">
  div
    range-slider(
      label="横範囲"
      :disabled="!source"
      :min="0"
      :max="width"
      v-model="horizontal"
    )
    range-slider(
      label="縦範囲"
      :disabled="!source"
      :min="0"
      :max="height"
      v-model="vertical"
    )
</template>

<script lang="ts">
import { DesktopCapturerSource } from 'electron';
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import BoundingBox from '../types/BoundingBox';
import { getStream } from '../utilities/media';
import RangeSlider from './RangeSlider.vue';

@Component({
  components: {
    RangeSlider,
  },
})
export default class CroppingController extends Vue {
  @Prop({ required: true, type: Object }) private value!: BoundingBox;
  @Prop({ type: Object }) private source?: DesktopCapturerSource;

  private width: number = 100;
  private height: number = 100;

  @Watch('source')
  private async updateSize(): Promise<void> {
    if (!this.source) return;
    const stream = await getStream(this.source);
    const { width, height } = stream.getVideoTracks()[0].getSettings();
    this.width = width || 100;
    this.height = height || 100;
  }

  @Emit('input')
  private emitInput(value: BoundingBox): void {}

  private get horizontal(): number[] {
    return [this.value.left, this.value.right];
  }
  private set horizontal([left, right]: number[]) {
    this.emitInput({
      ...this.value,
      left,
      right,
    });
  }

  private get vertical(): number[] {
    return [this.value.top, this.value.bottom];
  }
  private set vertical([top, bottom]: number[]) {
    this.emitInput({
      ...this.value,
      top,
      bottom,
    });
  }

  private mounted(): void {
    this.updateSize();
  }
}
</script>
