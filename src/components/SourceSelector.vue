<template lang="pug">
  v-select(
    return-object
    label="ウィンドウ"
    item-text="name"
    :items="sources"
    :value="value"
    @click="update"
    @input="$emit('input', $event)"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getSources } from '../renderer/capture';
import { DesktopCapturerSource } from 'electron';

@Component({
})
export default class SourceSelector extends Vue {
  @Prop({ type: Object }) private value: DesktopCapturerSource | null = null;

  private sources: DesktopCapturerSource[] = [];

  private async update(): Promise<void> {
    this.sources = await getSources();
  }

  created(): void {
    this.update();
  }
}
</script>
