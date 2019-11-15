<template>
    <router-view></router-view>
</template>

<script>
    define(["Vue", "vue-meta"], function(Vue, Meta) {
        return Vue.component("default-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    meta: {
                       meta_title: "",
                       meta_description: "",
                       meta_keywords: "",
                       meta_image: ""
                    }
                }
            },
            beforeRouteEnter (to, from, next) {
                next(vm => {
                    // access to component instance via `vm`
                    vm.meta = vm.findMetaDataByPath(to.path);
                });
            },
            beforeRouteUpdate (to, from, next) {
                this.meta = this.findMetaDataByPath(to.path);
                next();
            },
            computed: {
                findMetaDataByPath () {
                    return this.$store.getters.findMetaDataByPath;
                }
            },
            metaInfo () {
               return {
                  title: this.meta.meta_title,
                  meta: [
                     { name: 'description', vmid: 'description', content: this.meta.meta_description },
                     { name: 'keywords',  vmid: 'keywords', content: this.meta.meta_keywords },
                     { property: 'og:title', vmid: 'og:title', content: this.meta.meta_title },
                     { property: 'og:description', vmid: 'og:description', content: this.meta.meta_description },
                     { property: 'og:image', vmid: 'og:image', content: this.meta.meta_image }
                  ]
               }
            }
        });
    });
</script>