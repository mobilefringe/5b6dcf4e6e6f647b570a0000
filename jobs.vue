<template>
	<div> <!-- for some reason if you do not put an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Leasing</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
    				<div v-if="jobs.length >= 1" v-for="item in jobs" :key="item.id">
                        <div class="row event_container">
                            <div class="col-md-4">
                                <div v-if="!store.no_store_logo">
                    			    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                    			    <img  class="store_img" :src="item.store_front_url_abs" :alt="item.name + 'Logo'">
                    			</div>
                    			
                                <div v-else class="no_logo_container">
                                    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                                    <div class="no_logo_text">
                                        <div class="store_text"><h4>{{ item.name }}</h4></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <p v-if="item.promotionable_type == 'Property'" class="event_store_name">{{ property.name }}</p>
                                <p v-else class="event_store_name">
                                    <router-link :to="{ name: 'storeDetails', params: { id: item.store.slug }}">
                                        {{ item.store.name }}
                                    </router-link>        
                                </p>
                                <h4 class="event_name">{{ item.name }}</h4>
                                <!--<p class="event_dates"><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>-->
                                <div class="event_desc" v-html="item.description_short"></div>
                                <router-link :to="{ name: 'promotionDetails', params: { id: item.slug, banner: pageBanner }}">
                                    <div class="animated_btn event_link">View Job Posting <i class="fas fa-angle-double-right"></i></div>
                                </router-link>
                                <hr class="event_seperator">
                            </div>
                        </div>
                    </div>
                </div>
		    </div>
		</transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("jobs-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    
                    var temp_repo = this.findRepoByName('Jobs Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b6dcf4e6e6f647b570a0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedJobs',
                    'findRepoByName',
                ]),
                jobs() {
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.processedJobs, function(value, key) {
                        today = moment().tz(vm.timezone);
                        webDate = moment(value.show_on_web_date).tz(vm.timezone);
                        if (today >= webDate) {
                            value.description_short = _.truncate(value.description, { 'length': 250 });

                            if (value.store != null && value.store != undefined && _.includes(value.store.store_front_url_abs, 'missing')) {
                                value.store.store_front_url_abs = vm.property.default_logo_url;
                            }
                            else if (value.store == null || value.store == undefined) {
                                value.store = {};
                                value.store.store_front_url_abs =  vm.property.default_logo_url;
                            }
                            temp_promo.push(value);
                        }
                    });
                    temp_promo = _.sortBy(temp_promo, ['created_at', 'start_date']).reverse();
                    return temp_promo;
                },
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([
                            this.$store.dispatch("getData", "repos"),
                            this.$store.dispatch("getData", "jobs")
                        ]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>