<template lang="pug">
  v-alert.ma-4(:icon="false" type="info" v-if="loading")
    v-progress-circular.mr-3(
      indeterminate
      v-slot:prepend
      :size="24"
    )
    span Now loading...
  v-alert.ma-4(type="error" v-else-if="error")
    | {{error.message}}
  div(v-else)
    slot(:value="value")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Await<T> extends Vue {
  @Prop({ required: true, type: Promise }) promise!: Promise<T>;

  value: T | null = null;
  loading = true;
  error: Error | null = null;

  @Watch('promise', { immediate: true })
  async awaitPromise(promise: Promise<T>) {
    try {
      this.value = await promise;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }
}
</script>
