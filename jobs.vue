<template>
	<div v-if="dataloaded">
		<div class="page_header" v-if="promoBanner" v-bind:style="{ backgroundImage: 'url(' + promoBanner.image_url + ')' }">
			<div class="site_container">
				<div class="header_content cap">
					<h1>{{$t("jobs_page.jobs")}}</h1>
					<h2 style="display:none;">Scroll to  view jobs</h2>
					<h3 style="display:none;">View all jobs below</h3>
				</div>
			</div>
		</div>
		<div class="site_container page_content">
			<div id="events_container" v-if="promotions.length > 0">
				<paginate name="promos" v-if="promos" :list="promos" class="paginate-list margin-60" :per="4">
					<div class="row event_container" v-for="(promo,index) in paginated('promos')" :class="{ 'last': index === (paginated('promos').length - 1) }">
						<div class="col-sm-6 col-md-4 event_image_container">
							<!--<router-link :to="'/jobs/'+ promo.slug" class="event_learn_more">-->
								<img :src="promo.store.store_front_url_abs"  class="event_image image" :alt="'Click here to view ' + promo.name"/>
							<!--</router-link>-->
						</div>
						<div class="col-sm-6 col-md-8 event_dets_container">
							<h4 class="event_name caps"  v-if="locale=='en-ca'">{{promo.name}}</h4>
							<h4 class="event_name caps"  v-else>{{promo.name_2}}</h4>
							<div v-if="promo.jobable_type == 'Store'">
    						    <h4 class="event_store_name caps" v-if="locale=='en-ca'">{{promo.store.name}}</h4>
    						    <h4 class="event_store_name caps" v-else>{{promo.store.name_2}}</h4>
    						</div>
							<div class="event_thick_line"></div>
							<p class="event_dates">{{promo.start_date | moment("MMM D", timezone)}} - {{promo.end_date | moment("MMM D", timezone)}}</p>
							<p class="event_desc"  v-if="locale=='en-ca'">{{promo.description_short}}</p>
							<p class="event_desc"  v-else>{{promo.description_short_2}}</p>
							<div class="text-right  col-sm-6" v-if="promo" style="padding:0">
								<router-link :to="'/jobs/'+ promo.slug" class="event_learn_more pull-left"  :aria="promo.name">
									{{$t("jobs_page.read_more")}} <i class="fa fa-angle-right" aria-hidden="true"></i>
								</router-link>
								<social-sharing :url="shareURL(promo.slug)" :title="promo.name" :description="promo.description" :quote="_.truncate(promo.description, {'length': 99})" twitter-user="BCCstyle" :media="promo.image_url" inline-template >
									<div class="blog-social-share pull_right">
										<div class="social_share">
											<network network="facebook">
												<i class="fa fa-facebook social_icons" aria-hidden="true"></i>
											</network>
											<network network="twitter">
												<i class="fa fa-twitter social_icons" aria-hidden="true"></i>
											</network>
										</div>
									</div>
								</social-sharing>
							</div>
						</div>
						<div class="col-sm-12">
							<hr>
						</div>
					</div>
				</paginate>
			</div>
			<div id="no_events" class="row" v-else>
				<div class="col-md-12">
					<p>{{$t("jobs_page.no_job_message")}}</p>
				</div>
			</div>
			<div class="row margin-60">
				<div class="col-md-12">
					<paginate-links for="promos" :async="true" :limit="5" :show-step-links="true"></paginate-links>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta", "vue-lazy-load", "vue-paginate"], function(Vue, Vuex, moment, tz, VueMoment, Meta, VueLazyload, VuePaginate) {
        Vue.use(Meta);
        Vue.use(VueLazyload);
        Vue.use(VuePaginate);
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    selectedDate: null,
                    filteredPromos:[],
                    dataloaded: false,
                    promoBanner: null,
                    paginate: ['promos'],
                    promos : null
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataloaded = true;
                    
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        this.promoBanner = temp_repo.images[0];
                    }
                    this.promos = this.promotions;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedJobs',
                    'findRepoByName',
                ]),
                promotions() {
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    _.forEach(this.processedJobs, function(value, key) {
                        today = moment().tz(vm.timezone);
                        webDate = moment(value.show_on_web_date).tz(vm.timezone);
                        if (today >= webDate) {
                            value.description_short = _.truncate(value.description, {
                                'length': 150
                            });
                            value.description_short_2 = _.truncate(value.description_2, {
                                'length': 150
                            });
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
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "jobs"), this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                shareURL(slug){
                    var share_url = "http://bramaleacitycentre.com/jobs/" + slug;
                    return share_url;
                },
            }
        });
    });
</script>