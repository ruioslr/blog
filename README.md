---
home: true
heroText: Blog of Ruios
tagline: Welcome to here!
actionText: GO →
footer: Here is the blog of ruios
sidebar: false
---

<script>
// hide sidebar of home page
export default {
    mounted() {
        document.querySelector('.theme-container').classList.add('no-sidebar')
    },
  }
</script>