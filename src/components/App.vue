<template lang="pug">
  v-app
    //- v-navigation-drawer(app)
    //- v-toolbar(app)
    v-content.muninn-content
      v-layout(row)
        v-flex(xs6)
          v-container
            source-selector(v-model="source")
            cropping-controller(:source="source" v-model="cropping")
          v-layout.blue-grey.lighten-5.muninn-viewer-container(fluid)
            source-viewer(:canvas="sr.canvas")
        v-flex(xs6)
          div
            div(v-for="line in lines") {{line}}
    //- v-footer(app)
</template>

<style lang="stylus">
@import '~material-design-icons-iconfont/dist/material-design-icons.css'
@import '~vuetify/src/stylus/main'
</style>

<style lang="stylus" scoped>
.muninn-content
  max-height 100%

.muninn-viewer-container
  overflow auto
</style>

<script lang="ts">
import { DesktopCapturerSource } from 'electron';
import VueCore from 'vue';
import Vuetify from 'vuetify';
import { Component, Vue, Watch } from 'vue-property-decorator';
import StreamRenderer from '../renderer/StreamRenderer';
import TextRecognizer from '../renderer/TextRecognizer';
import BoundingBox from '../types/BoundingBox';
import CroppingController from './CroppingController.vue';
import SourceSelector from './SourceSelector.vue';
import SourceViewer from './SourceViewer.vue';
import { getSources } from '../renderer/capture';

VueCore.use(Vuetify);

@Component({
  components: {
    CroppingController,
    SourceSelector,
    SourceViewer,
  },
})
export default class App extends Vue {
  private readonly sr = new StreamRenderer();
  private readonly tr = new TextRecognizer();

  private lines: string[] = [];
  private source: DesktopCapturerSource | null = null;

  private get cropping(): BoundingBox {
    return this.sr.cropping;
  }
  private set cropping(cropping: BoundingBox) {
    this.sr.cropping = cropping;
    localStorage.setItem('muninn:cropping', JSON.stringify(cropping));
  }

  @Watch('source')
  saveSourceId(): void {
    if (this.source) {
      localStorage.setItem('muninn:sourceId', this.source.id);
    } else {
      localStorage.removeItem('muninn:sourceId');
    }
  }

  @Watch('source')
  async updateStream(): Promise<void> {
    if (this.source) {
      this.sr.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: this.source.id,
          },
        } as any,
      });
    } else {
      this.sr.stream = null;
    }
  }

  async created() {
    Object.assign(window, {
      sr: this.sr,
      tr: this.tr,
    });
    this.sr.on('update', (image: Blob) => {
      this.tr.putImage(image);
    });
    this.tr.on('add', (line: string) => this.lines.unshift(line));

    const croppingJson = localStorage.getItem('muninn:cropping');
    if (croppingJson) {
      try {
        this.sr.cropping = JSON.parse(croppingJson);
      } catch (error) {
        localStorage.removeItem('muninn:cropping');
        console.error(error);
      }
    }

    const sourceId = localStorage.getItem('muninn:sourceId');
    if (sourceId) {
      const sources = await getSources();
      const source = sources.find(s => s.id === sourceId);
      if (source) this.source = source;
    }
  }
}
</script>
