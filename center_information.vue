<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h2>Center Information</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div v-if="main" v-html="main.body"></div>
                        </div>
                    </div>
                </div>
                <div class="location_image_container margin_60">
                    <div class="location_image" v-if="pageImages" v-for="item in pageImages">
                        <img :src="item.image_url" alt="" />   
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <h3 class="center inside_page_title">Amenities</h3>
                        </div>
                    </div>
                    <!--<div class="row">-->
                    <!--    <div class="col-md-6" v-if="amenities" v-for="item in amenities">-->
                    <!--        <p class="amenities_title">{{ item.title }}</p>-->
                    <!--        <div class="amenities_body" v-html="item.body"></div>-->
                    <!--    </div>-->
                    <!--</div>-->
                    <div class="row">
                        <div class="col-md-12" v-if="amenities" v-for="item in amenities">
                            <div class="amenities_body" v-html="item.body"></div>
                        </div>
                    </div>
                </div>
                <div class="location_image_container">
                    <div v-if="lowerBanner">
                        <div class="location_banner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + lowerBanner.image_url + ') center center fixed' }"></div>
                        <h1 v-if="lowerBanner.name">{{ lowerBanner.name }}</h1>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
	define(["Vue", "vuex"], function(Vue, Vuex) {
		return Vue.component("center-info-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    main: null,
                    amenities: null,
                    pageImages: null,
                    lowerBanner: null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Center Information Images');
                    if(temp_repo) {
                        var three_imgs = _.slice(temp_repo.images, [0], [3])
                        this.pageImages = three_imgs;

                        var one_img = temp_repo.images[3];
                        this.lowerBanner = one_img;
                    }
                    
                    this.main = response[1].data;
                    this.amenities = response[1].data.subpages
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'repos',
                    'findRepoByName'
                ])
            },
            methods: {
                loadData: async function () {
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/ .json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
	});
</script>