<template lang="pug">
  .muninn-source-viewer
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DesktopCapturerSource } from 'electron';
import BoundingBox from '../types/BoundingBox';
import { getStream } from '../utilities/media';

@Component({
  components: {
  },
})
export default class SourceViewer extends Vue {
  @Prop({ required: true, type: HTMLCanvasElement }) private canvas!: HTMLCanvasElement;

  private beforeDestroy(): void {
    this.$el.removeChild(this.canvas);
  }

  private mounted(): void {
    this.$el.appendChild(this.canvas);
  }
}
</script>
