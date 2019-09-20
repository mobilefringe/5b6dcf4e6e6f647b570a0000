require.config({
    paths: {
        'Vue': 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.min',
        'vue_router': 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.7.0/vue-router.min',
        'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.1/axios.min',
        'jquery': 'https://code.jquery.com/jquery-3.2.1.min',
        'lodash': 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min',
        'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min',
        'moment-timezone': 'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.14/moment-timezone-with-data-2012-2022.min',
        'vue-moment': 'https://mmvue.codecloudapp.com/vue-moment',
        'vue2-filters': 'https://cdn.jsdelivr.net/vue2-filters/0.1.8/vue2-filters.min',
        'vue': 'https://mmvue.codecloudapp.com/require-vuejs.min',
        'vuex': 'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.3.1/vuex.min',
        'vue-i18n': 'https://cdnjs.cloudflare.com/ajax/libs/vue-i18n/6.1.1/vue-i18n.min',
        'text': 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min',
        'json': 'https://unpkg.com/requirejs-plugins-current@1.0.3/src/json',
        'js-cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min',
        'vue-meta': 'https://unpkg.com/vue-meta@1.0.4/lib/vue-meta.min',
        'Fuse': 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.0.4/fuse.min',
        'datastore_mutation_types': 'https://mmvue.codecloudapp.com/datastore_mutation_types',
        'datastore_getters': 'https://mmvue.codecloudapp.com/datastore_getters',
        'datastore_actions': 'https://mmvue.codecloudapp.com/datastore_actions_test',
        'datastore_mutations': 'https://mmvue.codecloudapp.com/datastore_mutations',
        'datastore': 'https://mmvue.codecloudapp.com/datastore',
        'vuex-router-sync': 'https://mmvue.codecloudapp.com/vuex-router-sync',
        //append a dummy query string so requireJS doesn't auto-append .js to the end of the url
        'vue-simple-spinner': 'https://cdn.jsdelivr.net/npm/vue-simple-spinner@1.2.8/dist/vue-simple-spinner.min',
        'vue-breadcrumbs': 'https://cdn.jsdelivr.net/npm/vue-breadcrumbs@1.1.2/dist/vue-breadcrumbs.min',
        'today_hours': 'https://mmvue.codecloudapp.com/today_hours.vue?noext', 
        'search-component': 'https://mmvue.codecloudapp.com/search-component.vue?noext',
        'slick': 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min',
        'vue-slick': 'https://mmvue.codecloudapp.com/slick.vue?noext',
        'vue-social-sharing': 'https://cdn.jsdelivr.net/npm/vue-social-sharing@2.3.3/dist/vue-social-sharing.min',
        'lightbox': 'https://5a1835f66e6f6422a6650000.codecloudapp.com/lightbox-mod',
        'vue-lazy-load': 'https://unpkg.com/vue-lazyload/vue-lazyload',
        'vee-validate' : 'https://cdn.jsdelivr.net/npm/vee-validate@2.1.4/dist/vee-validate',
        'vue-select': 'https://cdn.jsdelivr.net/npm/vue-select@2.3.0/dist/vue-select.min',
        'bootstrap-vue' : 'https://codecloud.cdn.speedyrails.net/sites/59347e776e6f64538f150000/text/javascript/1554736414383/bootstrap-vue',
        'masonry' : 'https://cdnjs.cloudflare.com/ajax/libs/masonry/4.0.0/masonry.pkgd.min',
        'vue-masonry-plugin' : 'https://cdn.jsdelivr.net/npm/vue-masonry@0.10.16/dist/vue-masonry-plugin',
        // 'vue-masonry-plugin' : "https://codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/application/javascript/1529435130000/masonrymod",
        //mappplic-png--map dependencies
        'mousewheel' : 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min',
        'mapplic' : 'https://mmvue.codecloudapp.com/mapplic',
        'hammer' : 'https://codecloud.cdn.speedyrails.net/sites/59bac7db6e6f644f22ba0000/text/javascript/1484859750000/hammer.min',
        'mapplic-png-map' : 'https://mmvue.codecloudapp.com/mapplic_png.vue?noext',
        'loader': 'https://mmvue.codecloudapp.com/loader.vue?noext',
        //google map dependcies
        'google-map-api': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCukCjH3fsuDYBdI44hZKL43m60jEToJjY',
        'google_map': 'https://mmvue.codecloudapp.com/google_map.vue?noext',
        'image_popup':'https://mmvue.codecloudapp.com/image_popup.vue?noext',
    }
});

require(['Vue', 'vuex', 'vue2-filters', 'vue_router', 'routes', 'vuex-router-sync', 'datastore', 'vue-i18n', 'locales', 'moment', 'vue-meta', 'vue-breadcrumbs', 'vue!loading.vue', 'vue!messages.vue', 'vue!header.vue', 'vue!footer.vue', 'vue!inside_header.vue', 'vue!breadcrumb.vue',], function (Vue, Vuex, Vue2Filters, VueRouter, appRoutes, VuexRouterSync, store, VueI18n, messages, moment, Meta, VueBreadcrumbs, LoadingComponent, MessagesComponent, HeaderComponent, FooterComponent, insideHeaderComponent, BreadcrumbComponent) {
    
    Vue.use(Meta);
    Vue.use(VueRouter);
    Vue.use(Vue2Filters);
    Vue.use(VueI18n);
    Vue.use(VueBreadcrumbs);
    
    /* initialize router */
    const router = new VueRouter({
        mode: 'history',
        routes: appRoutes,
        scrollBehavior(to, from, savedPosition) {
            return {
                x: 0,
                y: 0
            }
        }
    });

    /* initialize i18n */
    const i18n = new VueI18n({
        locale: 'en-ca',
        fallbackLocale: 'en-ca',
        messages: messages,
    });
  
    VuexRouterSync.sync(store, router)

    /* bootstrap app */
    const vm = new Vue({
        el: '#app',
        data: function () {
            return {
                breadcrumb: this.$breadcrumbs,
                menu_items: [
                    {
                        name: "Directory",
                        id: "menu1",
                        href: "#",
                        sub_menu: [
                            {
                                name: "Directory",
                                href: "/stores"
                            },
                            {
                                name: "Dining",
                                href: "/dine"
                            },
                            {
                                name: "Center Map",
                                href: "/map"
                            }
                        ]
                    },
                    {
                        name: "Events & Promotions",
                        href: "/events-and-promotions"
                    },
                    {
                        name: "Location",
                        href: "/location",
                    },
                    {
                        name: "Center Information",
                        id: "menu2",
                        href: "#",
                        sub_menu: [
                            {
                                name: "Contact Us",
                                href: "/contact-us"
                            },
                            {
                                name: "Jobs",
                                href: "/jobs"
                            },
                            {
                                name: "Leasing",
                                href: "/leasing"
                            },
                            {
                                name: "Specialty Leasing",
                                href: "/specialty-leasing"
                            },
                            {
                                name: "Newsletter Sign Up",
                                href: "/newsletter"
                            }
                        ]
                    }
                ],
                social_media: [
                    {
                        name: "Facebook",
                        url: "https://www.facebook.com/EastWashingtonPlace",
                        iconClass: "fab fa-facebook"
                    },
                    {
                        name: "Instagram",
                        url: "https://www.instagram.com/eastwashingtonplace/",
                        iconClass: "fab fa-instagram"
                    }
                ],
            }
        },
        created: function ()  {
            this.loadData().then(response => {
                this.$store.dispatch("setDataLoaded", true);      
            });
        },
        watch: {
            // watcher to update vue-i18n when the locale has been changed by the user
            locale: function (val, oldVal) {
                this.$i18n.locale = val;
                moment.locale(val);
            }
        },
        computed: {
            // computed property for locale which returns locale value from data store and also updates the data store with new locale information
            locale: {
                get () {
                    return this.$store.state.locale
                },
                set (value) {
                    this.$store.commit('SET_LOCALE', { lang: value })
                }
            },
            ...Vuex.mapGetters([
                'dataLoaded',
                'property'
            ])
        },
        methods: {
            loadData: async function() {
                try{
                    await this.$store.dispatch('initializeApi', { site: "eastwashington", version: "v4" });
                    await Promise.all([this.$store.dispatch("getData", "property")]);
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    let results = await Promise.all([
                        this.$store.dispatch("INITIALIZE_LOCALE"), 
                        this.$store.dispatch("getData", "hours"), 
                        this.$store.dispatch("getData", "stores")
                    ]);
                    await Promise.all([this.$store.dispatch("LOAD_META_DATA")]);
                    return results;
                } catch (e) {
                    console.log("Error loading data: " + e.message);    
                }
            },
            // utility method to allow user to change locale value
            changeLocale: function(val) {
                this.locale = val; // this will update the data store, which in turn will trigger the watcher to update the locale in the system
            }
        },
        router: router,
        store,
        i18n
    });
});