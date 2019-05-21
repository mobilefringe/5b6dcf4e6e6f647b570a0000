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
    				<div class="row event_container" v-for="(item, index) in jobs" :class="{ 'last': index === (jobs.length - 1) }">
    					<div class="col-sm-6 col-md-4 event_image_container">
    						<!--<router-link :to="'/jobs/'+ item.slug" class="event_learn_more">-->
    							<img :src="item.store.store_front_url_abs"  class="event_image image" :alt="'Click here to view ' + item.name"/>
    						<!--</router-link>-->
    					</div>
    					<div class="col-sm-6 col-md-8 event_dets_container">
    						<h4 class="event_name caps"  v-if="locale=='en-ca'">{{item.name}}</h4>
    						<h4 class="event_name caps"  v-else>{{item.name_2}}</h4>
    						<div v-if="item.jobable_type == 'Store'">
    						    <h4 class="event_store_name caps" v-if="locale=='en-ca'">{{item.store.name}}</h4>
    						    <h4 class="event_store_name caps" v-else>{{item.store.name_2}}</h4>
    						</div>
    						<div class="event_thick_line"></div>
    						<p class="event_dates">{{item.start_date | moment("MMM D", timezone)}} - {{item.end_date | moment("MMM D", timezone)}}</p>
    						<p class="event_desc"  v-if="locale=='en-ca'">{{item.description_short}}</p>
    						<p class="event_desc"  v-else>{{item.description_short_2}}</p>
    						<div class="text-right  col-sm-6" v-if="item" style="padding:0">
    							<router-link :to="'/jobs/'+ item.slug" class="event_learn_more pull-left"  :aria="item.name">
    								{{$t("jobs_page.read_more")}} <i class="fa fa-angle-right" aria-hidden="true"></i>
    							</router-link>
    							<social-sharing :url="shareURL(item.slug)" :title="item.name" :description="item.description" :quote="_.truncate(item.description, {'length': 99})" twitter-user="BCCstyle" :media="item.image_url" inline-template >
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
    			</div>
    			<div id="no_events" class="row" v-else>
    				<div class="col-md-12">
    					<p>{{$t("jobs_page.no_job_message")}}</p>
    				</div>
    			</div>
		    </div>
		</transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment"], function(Vue, Vuex, moment, tz, VueMoment) {
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    selectedDate: null,
                    filteredPromos:[],
                    dataloaded: false,
                    promoBanner: null,
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataloaded = true;
                    
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        this.promoBanner = temp_repo.images[0];
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