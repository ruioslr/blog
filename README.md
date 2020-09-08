---
home: true
heroText: null
heroImage: /leimu-2.jpg
tagline: Believe yourself, and you are halfway there
actionText: GO →
footer: Here is the blog of ruios
sidebar: false
heroImageStyle: {
  borderRadius: '50%',
#   width: "530px",
  boxShadow: '0 5px 18px rgba(0,0,0,0.2)'
}
bgImageStyle: {
    height: '350px',
    color: '#3399FF',
}
---

<script>
// hide sidebar of home page
export default {
    mounted() {
        document.querySelector('.theme-container').classList.add('no-sidebar')
    },
  }
</script>