<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Events & Promotions</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row margin_40">
        		        <div class="col-md-6 clearfix">
        		            <button :class="{ change_color: toggleEvents }" class="animated_btn stores_btn" @click="toggleView('events')">Events</button>
        		            <button :class="{ change_color: togglePromos }" class="animated_btn stores_btn" @click="toggleView('promos')">Promotions</button>
        		        </div>
        		    </div>
                    <div v-if="toggleEvents">
                        <div v-if="eventList" v-for="(events, key) in eventList">
                            <div class="row">
                                <div class="col-md-12">
                                    <h3 class="event_date_heading">{{ key }}</h3> 
                                </div>
                            </div>
                            <div class="row event_container" v-for="event in events">
                                <div class="col-md-4">
                                    <img :src="event.image_url" :alt="'Event: ' + event.name" class="event_img img_max" />   
                                </div>
                                <div class="col-md-8">
                                    <h4 class="event_name">{{ event.name }}</h4>
                                    <p class="event_dates"><span v-if="event.tags && event.tags.length >0">{{event.tags[0]}} | </span> <span v-if="isMultiDay(event)">{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ event.start_date | moment("MMMM D", timezone)}}</span></p>
                                    <div class="event_desc" v-html="event.description_short"></div>
                                    <router-link :to="{ name: 'eventDetails', params: { id: event.slug, banner: pageBanner }}">
                                        <p class="event_link">Event Details <i class="fas fa-angle-double-right"></i></p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div class="row margin_60" v-if="Object.keys(eventList).length === 0">
                            <div class="col-md-12">
                                <p>Sorry, there are no Events posted at this time. Please check back soon!</p>    
                            </div>
                        </div>
                    </div>
                    <div v-if="togglePromos">
                        <transition-group name="list" tag="div">
                            <div v-if="promos.length >= 1" v-for="item in promos" :key="item.id">
                                <div class="row event_container">
                                    <div class="col-sm-6 col-md-4">
                                        <img :src="item.image_url" :alt="'Promotion: ' + item.name" class="event_img img_max" />   
                                    </div>
                                    <div class="col-sm-6 col-md-8">
                                        <p v-if="item.promotionable_type == 'Property'" class="event_store_name">{{ property.name }}</p>
                                        <p v-else class="event_store_name">
                                            <router-link :to="{ name: 'storeDetails', params: { id: item.store.slug }}">
                                                {{ item.store.name }}
                                            </router-link>        
                                        </p>
                                        <h4 class="event_name">{{ item.name }}</h4>
                                        <p class="event_dates"><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
                                        <div class="event_desc" v-html="item.description_short"></div>
                                        <router-link :to="{ name: 'promotionDetails', params: { id: item.slug, banner: pageBanner }}">
                                            <p class="event_link">Promotion Details <i class="fas fa-angle-double-right"></i></p>
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                        <div v-if="promos.length == 0">
                            <div class="row">
                                <div class="col-md-12">
                                    <p>Sorry, there are no Promotions posted at this time. Please check back soon!</p>    
                                </div>
                            </div>
                        </div>
                        <div class="row margin_60">
                            <div class="col-md-12">
                                <button class="animated_btn event_load_more" v-if="!noMorePromos" @click="handleButton">Load More</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load", "bootstrap-vue"], function (Vue, Vuex, moment, tz, VueMoment, VueLazyload, BootstrapVue) {
        Vue.use(BootstrapVue);
        Vue.use(VueLazyload);
        return Vue.component("events-and-promotions-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    toggleEvents: true,
                    togglePromos: false,
                    promos: [],
                    morePromos: [],
                    morePromosFetched: false,
                    noMorePromos: false,
                    noPromos: false
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Events Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b6dcf4e6e6f647b570a0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedEvents',
                    'processedPromos',
                    'findRepoByName'
                ]),
                eventList: function events() {
                    var events = _.orderBy(this.processedEvents, function (o) { return o.start_date });
                    var showEvents = [];
                    var month_heading = "";
                    _.forEach(events, function (value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        var today_month = moment.tz(this.timezone).format("MM-YYYY");
                        if (today >= showOnWebDate) {
                            var start_month = moment.tz(value.start_date, this.timezone).format("MM-YYYY");
                            if (start_month <= today_month) {
                                value.month = moment.tz(this.timezone).format("MMMM YYYY");
                                month_heading = today_month;
                            } else {
                                value.month = moment.tz(value.start_date, this.timezone).format("MMMM YYYY");
                                month_heading = start_month;
                            }

                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529532187000/eventsplaceholder2@2x.png";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529532187000/eventsplaceholder2@2x.png";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
                            showEvents.push(value);
                        }
                    });
                    showEvents = _.orderBy(showEvents, function (o) { return o.end_date });
                    showEvents = _.groupBy(showEvents, event => (event.month));
                    return showEvents
                },
                promoList: function promos() {
                    var vm = this;
                    var showPromos = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529532181000/promoplaceholder2@2x.png";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1529532181000/promoplaceholder2@2x.png";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
                            showPromos.push(value);
                        }
                    });
                    var sortedPromos = _.orderBy(showPromos, [function(o) { return o.end_date; }]);
                    return sortedPromos;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "events"), this.$store.dispatch("getData","promotions")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                toggleView(item) {
                    if(this.promos.length == 0) {
                        this.handleButton();
                    }
                    
                    if(this.toggleEvents) { 
                        this.toggleEvents = false
                    } else {
                        this.toggleEvents = true
                    }
                    
                    if(this.togglePromos) {
                        this.togglePromos = false
                    } else {
                        this.togglePromos = true
                    }
                },
                isMultiDay(promo) {
                    var timezone = this.timezone
                    var start_date = moment(promo.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(promo.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                },
                handleButton: function () {
                    if(!this.morePromosFetched){
                        this.morePromos = this.promoList;
                        this.promos = this.morePromos.splice(0, 3);
                        this.morePromosFetched = true;
                    } else {
                        var nextPromos = this.morePromos.splice(0, 3);
                        // Add 3 more posts to posts array
                        var vm = this;
                        _.forEach(nextPromos, function(value, key) {
                            vm.promos.push(value);
                        });
                    }
                    if(this.promoList.length === 0){
                        this.noMorePromos = true
                        this.noPromos = true
                    }
                }
            }
        });
    });
</script>
