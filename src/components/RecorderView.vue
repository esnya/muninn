<template lang="pug">
  v-card.muninn-recorder-view
    v-card-text
      v-range-slider(:min="0" :max="videoSettings.width" v-model="horizontal")
      video(:style="croppingStyle")
</template>

<script lang="ts">
import mapValues from 'lodash/mapValues';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Recorder from '../Recorder';

@Component({
  components: {},
})
export default class RecorerView extends Vue {
  @Prop({ required: true, type: Recorder as any }) recorder!: Recorder;

  horizontal = [0, 0];
  vertical = [0, 0];

  get videoTrack(): MediaStreamTrack {
    return this.recorder.stream.getVideoTracks()[0];
  }

  get videoSettings(): MediaTrackSettings {
    return this.videoTrack.getSettings();
  }

  get croppingStyle(): Record<string, string> {
    const [left, right] = this.horizontal;
    const [top, bottom] = this.vertical;

    const width = right - left;
    const height = bottom - top;

    return mapValues(
      {
        marginLeft: -left,
        marginTop: -top,
        width,
        height,
      },
      value => `${value}px`,
    );
  }

  @Watch('recorder')
  setSrc(recorder: Recorder) {
    const videos = this.$el.querySelectorAll('video');
    videos.forEach(video => {
      video.srcObject = recorder.stream;
      video.play();
    });
  }

  mounted() {
    this.horizontal[1] = this.videoSettings.width || 0;
    this.vertical[1] = this.videoSettings.height || 0;
    this.setSrc(this.recorder);
  }
}
</script>

<style lang="stylus" scoped></style>
