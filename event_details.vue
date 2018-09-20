<template>
    <div> <!-- Without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Events & Promotions</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row hidden-xs">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div  v-if="currentEvent">
                        <div class="row">
                            <div class="col-md-8">
                                <h4 class="event_name">{{ currentEvent.name }}</h4>
                                <p class="event_details_dates">
                                    <span v-if="isMultiDay(currentEvent)">{{ currentEvent.start_date | moment("MMMM D", timezone)}} - {{ currentEvent.end_date | moment("MMMM D", timezone)}}</span>
                                    <span v-else>{{ currentEvent.start_date | moment("MMMM D", timezone)}}</span>
                                </p>
                                <p class="event_details_dates" v-if="currentEvent.tags && currentEvent.tags.length > 0">
                                    {{currentEvent.tags[0]}}
                                </p>
                                <div class="event_desc event_details" v-html="currentEvent.rich_description"></div>
                            </div>
                            <div class="col-md-4">
                                <a :href="currentEvent.image_url" :data-lightbox="currentEvent.name">
                                    <img v-lazy="currentEvent.image_url" :alt="'Promotion: ' + currentEvent.name" class="margin_20 img_max"/>    
                                </a>
                            </div>
                        </div>
                        <div class="row margin_60">
                            <div class="col-md-12">
                                <div class="row margin_30">
                                    <div class="col-md-12">
                                        <router-link to="/events-and-promotions">
                    		                <div class="animated_btn pull-left">Back to Events & Promotions</div>    
                    		            </router-link>    
                                    </div>
                                </div>
                                <social-sharing v-if="currentEvent" :url="shareURL(currentEvent.slug)" :title="currentEvent.name" :description="currentEvent.description" :quote="truncate(currentEvent.description)" :twitter-user="siteInfo.twitterHandle" :media="currentEvent.image_url" inline-template>
                                    <div class="social_share">
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
	define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "lightbox", "vue-lazy-load",  "vue-social-sharing", "json!site.json"], function(Vue, Vuex, moment, tz, VueMoment, Lightbox, VueLazyload, SocialSharing, site) {
        Vue.use(VueLazyload);
        Vue.component('social-sharing', SocialSharing);
		return Vue.component("event-details-component", {
			template: template, // the variable template will be injected,
			props: ['id', 'banner'],
			data: function() {
				return {
					dataLoaded: false,
					pageBanner: null,
					currentEvent: null,
				    siteInfo: site,
				}
			},
			created() {
			    this.$store.dispatch("getData", "repos").then(response => {
			        var temp_repo = this.findRepoByName('Events Banner').images;
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

				this.$store.dispatch("getData", "events").then(response => {
					this.currentEvent = this.findEventBySlug(this.id);
					if (this.currentEvent === null || this.currentEvent === undefined) {
						this.$router.replace({ path: '/events-and-promotions' });
					}
					this.$breadcrumbs[0].path = "/events-and-promotions"
					this.$breadcrumbs[1].meta.breadcrumb = this.currentEvent.name
					
					this.dataLoaded = true;
				}, error => {
					console.error("Could not retrieve data from server. Please check internet connection and try again.");
				});
			},
			watch: {
                currentEvent : function (){
                    if(this.currentEvent != null) {
                        if (this.currentEvent.eventable_type === "Store"){
                            if (_.includes(this.currentEvent.event_image_url_abs, 'missing')) {
                                this.currentEvent.image_url = this.currentEvent.store.store_front_url_abs; 
                            }
                        } else {
                            if (_.includes(this.currentEvent.event_image_url_abs, 'missing')) {
                                this.currentEvent.image_url = "//codecloud.cdn.speedyrails.net/sites/5b6dcf4e6e6f647b570a0000/image/jpeg/1537463477000/ewp-events-compressor.jpg";    
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
					'processedEvents',
					'findEventBySlug'
				])
			},
			methods: {
				isMultiDay(currentEvent) {
					var timezone = this.timezone
					var start_date = moment(currentEvent.start_date).tz(timezone).format("MM-DD-YYYY")
					var end_date = moment(currentEvent.end_date).tz(timezone).format("MM-DD-YYYY")
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