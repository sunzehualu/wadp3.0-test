<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default  {
  name:  'App',
  watch: {
    warterMark(val) {
      if(val){
          var warterMarkDom = document.getElementById('warterMark');
          warterMarkDom.style.display="block";
      }else{
          var warterMarkDom = document.getElementById('warterMark');
          warterMarkDom.style.display="none";
      }
    }
  },
  computed: {
    ...mapState({
      warterMark: state => state.settings.warterMark,  
    }),
  },
}
</script>
