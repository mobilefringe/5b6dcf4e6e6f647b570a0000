<template>
    <div> <!-- Without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Jobs</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row hidden-xs">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div v-if="currentJob">
                        <div class="row job_details event_container">
                            <div class="col-md-8">
                                <p v-if="currentJob.jobable_type == 'Property'" class="event_store_name">{{ property.name }}</p>
                                <p v-else class="event_store_name">{{ currentJob.store.name }}</p>
                                <h4 class="event_name">{{ currentJob.name }}</h4>
                                <p class="event_dates">
                                    <span v-if="isMultiDay(currentJob)">{{ currentJob.start_date | moment("MMMM D", timezone)}} - {{ currentJob.end_date | moment("MMMM D", timezone)}}</span>
                                    <span v-else>{{ currentJob.start_date | moment("MMMM D", timezone)}}</span>
                                </p>
                                <div class="event_desc event_details" v-html="currentJob.rich_description"></div>
                            </div>
                            <div class="col-md-4 hidden-sm hidden-xs">
                                <div class="store_logo_container jobs">
                                    <div v-if="!currentJob.no_store_logo" class="logo_container">
                        			    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                        			    <img  class="store_img" :src="currentJob.store.store_front_url_abs" :alt="currentJob.name + 'Logo'">
                        			</div>
                        			
                                    <div v-else class="no_logo_container">
                                        <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                                        <div class="no_logo_text">
                                            <div class="store_text"><h4>{{ currentJob.store.name }}</h4></div>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row margin_30">
                                    <div class="col-md-12">
                                        <router-link to="/jobs">
                    		                <div class="animated_btn pull-left">Back to Jobs</div>    
                    		            </router-link>    
                                    </div>
                                </div>
                                <social-sharing v-if="currentJob" :url="shareURL(currentJob.slug)" :title="currentJob.name" :description="currentJob.description" :quote="truncate(currentJob.description)" :twitter-user="siteInfo.twitterHandle" :media="currentJob.image_url" inline-template>
                                    <div class="social_share margin_60">
                                        <network network="facebook">
                                            <i class="fab fa-facebook"></i>
                                        </network>
                                        <network network="twitter">
                                            <i class="fab fa-twitter"></i>
                                        </network>
                                        <network network="email">
                                            <i class="fas fa-envelope"></i>
                                        </network>
                                    </div>
                                </social-sharing>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-social-sharing", "json!site.json"], function(Vue, Vuex, moment, tz, VueMoment, SocialSharing, site) {
        Vue.component('social-sharing', SocialSharing);
        return Vue.component("job-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentJob: null,
                    siteInfo: site
                }
            },
            created() {
                this.$store.dispatch("getData", "repos").then(response => {
			        var temp_repo = this.findRepoByName('Jobs Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b6dcf4e6e6f647b570a0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
			    }, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
				
				this.$store.dispatch("getData", "jobs").then(response => {
					this.currentJob = this.findJobBySlug(this.id);
					if (this.currentJob === null || this.currentJob === undefined) {
						this.$router.replace({ path: '/jobs' });
					} else {
    					this.$breadcrumbs[0].path = "/jobs"
    					this.$breadcrumbs[1].meta.breadcrumb = this.currentJob.name
    					this.dataLoaded = true;
					}
				}, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
			},
			watch: {
                currentJob : function (){
                    if (this.currentJob != null) {
                        if (this.currentJob != null && this.currentJob != undefined) {
                            if (!_.isEmpty(this.currentJob.store)) {
                                if (_.includes(this.currentJob.store.store_front_url_abs, 'missing')) {
                                    this.currentJob.no_store_logo = true;
                                } else {
                                    this.currentJob.no_store_logo = false;
                                }
                            } else {
                                this.currentJob.store = {};
                                this.currentJob.store.store_front_url_abs =  this.siteInfo.siteLogo;
                            }
                        }
                    }
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'findJobBySlug'
                ])
            },
            methods: {
				isMultiDay(currentJob) {
					var timezone = this.timezone
					var start_date = moment(currentJob.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentJob.end_date).tz(timezone).format("MM-DD-YYYY")
					if (start_date === end_date) {
						return false
					} else {
						return true
					}
				},
				truncate(val_body) {
                    var truncate = _.truncate(val_body, { 'length': 99, 'separator': ' ' });
                    return truncate;
                },
				shareURL(slug) {
                    var share_url = window.location.href
                    return share_url
                }
			}
        });
    });
</script>