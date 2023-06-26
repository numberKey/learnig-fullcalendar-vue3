<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ViewSelector",
  data() {
    return {
      value: "timeGridWeek",
      options: [
        { value: "dayGridMonth", label: "月" },
        { value: "timeGridWeek", label: "週" },
        { value: "timeGridDay", label: "日" },
      ],
    };
  },
  methods: {},
  watch: {
    value: function (val: string) {
      this.$emit("change-view-mode", val);
    },
  },
});
</script>

<template>
  <el-select v-model="value" class="m-2" placeholder="Select" size="large">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<style lang="css"></style>
