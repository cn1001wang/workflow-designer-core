<template>
  <WorkflowDesigner v-model="fs"></WorkflowDesigner>
</template>

<script>
import WorkflowDesigner from "./components/WorkflowDesigner.vue";
export default {
  name: "App",
  components: { WorkflowDesigner },
  data() {
    return {
      fs: {
        nodes: [],
      },
    };
  },
};
</script>
