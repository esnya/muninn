<template lang="pug">
  v-app
    v-app-bar(
      app
      dark
      color="primary"
    )
      v-toolbar-title.headline muninn
    v-content
      v-row
        v-col
          await(:promise="recorder")
            template(v-slot="{ value }")
              recorder-view(:recorder="value")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Await from './components/Await.vue';
import RecorderView from './components/RecorderView.vue';
import Recorder from './Recorder';

@Component({
  components: {
    Await,
    RecorderView,
  },
})
export default class App extends Vue {
  readonly recorder = Recorder.create();
}
</script>
