<script setup lang="ts"></script>

<template>
  <page-meta backgroundTextStyle="light" />
  <slot />
</template>

<style src="../../packages/ui/tokens.css"></style>
<style>
page {
  background-color: var(--bg-blush);
  font-family: var(--font-family);
}
</style>
