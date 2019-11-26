<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header">
                    <div class="main_container position_relative">
                        <h1>Sales & Promotions</h1>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <transition-group name="list" tag="div">
                        <div v-if="events" v-for="item in events" :key="item.id">
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
                                    <router-link :to="{ name: 'promotionDetails', params: { id: item.slug }}">
                                        <p class="event_link">Promotion Details <i class="fas fa-angle-double-right"></i></p>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="row">
                                <div class="col-md-12">
                                    <p>Sorry, there are no Promotions posted at this time. Please check back soon!</p>    
                                </div>
                            </div>
                        </div>
                    </transition-group>
                    <div class="row margin_60">
                        <div class="col-md-12">
                            <button class="animated_btn event_load_more" v-if="!noMoreEvents" @click="handleButton">Load More</button>
                            <p v-if="noEvents">No More Promotions</p>
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
        return Vue.component("promotions-component", {
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
                    this.handleButton();
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedPromos'
                ]),
                promoList: function promos() {
                    var vm = this;
                    var showPromos = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (value.store != null && value.store != undefined && _.includes(value.store.image_url, 'missing')) {
                                value.store.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/png/1529532181000/promoplaceholder2@2x.png";
                            }
                            
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/png/1529532181000/promoplaceholder2@2x.png";
                            }
                            
                            value.description_short = _.truncate(value.description, { 'length': 250, 'separator': ' ' });
                            
                            showPromos.push(value);
                        }
                    });
                    var sortedPromos = _.orderBy(showPromos, [function(o) { return o.end_date; }]);
                    if (sortedPromos.length > 0) {
                        this.togglePromos = true;
                    }
                    return sortedPromos;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "events"), this.$store.dispatch("getData","promotions")]);
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
                        this.moreEvents = this.promoList;
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
                    if(this.promoList.length === 0){
                        this.noMoreEvents = true
                        this.noEvents = true
                    } else {

                    }
                }
            }
        });
    });
</script>
