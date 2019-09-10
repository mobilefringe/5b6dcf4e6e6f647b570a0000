<template>
    <div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Pop-Up Specialty Leasing</h2>
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
                    <div class="row">
                        <div class="col-md-12">
                            <a v-if="leasingBooklet" :href="leasingBooklet" target="_blank">
        		                <div class="animated_btn leasing_btn">
        		                    Leasing Booklet
        		                </div>    
        		            </a>    
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="leasing_contact" v-if="leasingInfo" v-html="leasingInfo.body"></div>
                        </div>
                    </div>
                </div>
                <div class="location_image_container">
                    <div class="location_image" v-if="pageImages" v-for="item in pageImages">
                        <img :src="item.image_url" alt="" />   
                    </div>
                </div>
                <!--<div class="location_image_container">-->
                <!--    <div class="location_image" v-if="pageImages" v-for="item in pageImages">-->
                <!--        <img :src="item.image_url" alt="" />   -->
                <!--    </div>-->
                <!--</div>-->
            </div>
        </transition>
    </div>
</template>

<script>
	define(["Vue", "vuex"], function(Vue, Vuex) {
		return Vue.component("location-component", {
            template: template, // the variable template will be injected
            data: function () {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    main: null,
                    leasingInfo: null,
                    leasingBooklet: null,
                    pageImages: null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Specialty Leasing Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5d7017836e6f641aaf4f0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                    
                    var temp_repo1 = this.findRepoByName('Leasing Booklet');
                    if(temp_repo1) {
                        try {
                            this.leasingBooklet = temp_repo1.images[0].image_url;
                        } catch (e) {
                            
                        }
                    }

                    var temp_repo2 = this.findRepoByName('Specialty Leasing Images');
                    if(temp_repo2) {
                        try {
                            this.pageImages = temp_repo2.images;
                        } catch (e) {
                            
                        }
                    }

                    this.main = response[1].data;
                    this.leasingInfo = response[1].data.subpages[0];
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
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/eastwashington-pop-up-specialty-leasing.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
	});
</script>