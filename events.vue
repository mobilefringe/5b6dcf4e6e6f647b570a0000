<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h1>Events</h1>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row margin_60">
                        <div v-if="eventList" v-for="(events, key) in eventList" class="col-md-12" >
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
                                    <h2 class="event_name">{{ event.name }}</h2>
                                    <p class="event_dates"><span v-if="event.tags && event.tags.length >0">{{event.tags[0]}}</span> | <span v-if="isMultiDay(event)">{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ event.start_date | moment("MMMM D", timezone)}}</span></p>
                                    <div class="event_desc" v-html="event.description_short"></div>
                                    <router-link :to="{ name: 'eventDetails', params: { id: event.slug }}">
                                        <p class="event_link">Event Details <i class="fas fa-angle-double-right"></i></p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>Sorry, there are no Events posted at this time. Please check back soon!</p>    
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
        return Vue.component("promotions-and-events-component", {
            template: template, // the variable template will be injected,
            data: function () {
                return {
                    dataLoaded: false,
                    events: [],
                    moreEvents: [],
                    moreEventsFetched: false,
                    noMoreEvents: false,
                    noEvents: false
                }
            },
            created (){
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedEvents'
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
                                value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/png/1529532187000/eventsplaceholder2@2x.png";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/png/1529532187000/eventsplaceholder2@2x.png";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
                            showEvents.push(value);
                        }
                    });
                    showEvents = _.orderBy(showEvents, function (o) { return o.end_date });
                    showEvents = _.groupBy(showEvents, event => (event.month));

                    return showEvents
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "events")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
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
                    if(!this.moreEventsFetched){
                        this.moreEvents = this.eventList;
                        this.events = this.moreEvents.splice(0, 3);
                        this.moreEventsFetched = true;
                    } else {
                        var nextEvents = this.moreEvents.splice(0, 3);
                        // Add 3 more posts to posts array
                        var vm = this;
                        _.forEach(nextEvents, function(value, key) {
                            vm.events.push(value);
                        });
                    }
                    if(this.eventList.length === 0){
                        this.noMoreEvents = true
                        this.noEvents = true
                    } else {

                    }
                }
            }
        });
    });
</script>
