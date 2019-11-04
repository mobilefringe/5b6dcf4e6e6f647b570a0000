<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>{{ currentStore.name }}</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="sidebar">
                                <div v-if="currentStore.no_logo" class="store_details_no_logo center-block">
                                    <div class="no_logo">
                                        <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png">
                                        <p class="store_details_name">{{ currentStore.name }}</p>
                                    </div>    
                                </div>
                                <div v-else id="store_dets_logo_container">
                                    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png">
                    			    <img  class="store_details_image" :src="currentStore.store_front_url_abs" alt="">
                                </div>
                                <div class="margin_20 center" v-if="currentStore.phone">
                                    <a class="store_details_phone" :href="'tel:' + currentStore.phone">{{ currentStore.phone }}</a>    
                                </div>
                                <div class="margin_20 center" v-if="currentStore.website">
                                    <a class="store_details_phone" :href="'//' + currentStore.website" target="_blank">Website</a>
                                </div>
                                <ul v-if="storeHours.length > 0" class="store_details_hours_list">
                                    <li v-for="hour in storeHours" :class="{ today: hour.todays_hours }">
                                        <div v-if="!hour.is_closed">
                                            <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span><span class="hours_list_time">{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}</span>
                                        </div>
                                        <div v-else>
                                            <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>CLOSED
                                        </div>
                                    </li>
                                    <li class="hours_vary">*Hours may vary</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div id="map" class="margin_20">
                                <mapplic-png-map ref="pngmap_ref" :height="314" :hovertip="true" :storelist="allStores" :floorlist="floorList" :svgWidth="property.map_image_width" :svgHeight="property.map_image_height" @updateMap="updatePNGMap"></mapplic-png-map>
                            </div>
                            <div class=" margin_30 store_details_desc" v-html="currentStore.rich_description"></div>
                            <div v-if="deliveryAvailable" class="margin_30">
                                <h3 class="store_details_title">Delivery Options:</h3>
                                <div class="store_details_delivery">
                                    <img v-if="hasDoordash" class="delivery_option" src="//codecloud.cdn.speedyrails.net/sites/5d8ac35a6e6f647bec090000/image/png/1568400931000/doordash.png" alt="Delivery available with DoorDash" />
                                    <!--<img v-if="hasGrubhub" class="delivery_option" src="//codecloud.cdn.speedyrails.net/sites/5d8ac35a6e6f647bec090000/image/png/1568400381000/grubhub.png" alt="Delivery available with Grubhub" />-->
                                    <img v-if="hasPostmates" class="delivery_option" src="//codecloud.cdn.speedyrails.net/sites/5d8ac35a6e6f647bec090000/image/png/1569270191004/postmates.png" alt="Delivery available with Postmates" />
                                    <div v-if="hasRestaurantDelivery" class="delivery_option"><span>Restaurant Delivery</span></div>
                                    <img v-if="hasUberEats" class="delivery_option" src="//codecloud.cdn.speedyrails.net/sites/5d8ac35a6e6f647bec090000/image/png/1568400422000/ubereats.png" alt="Delivery available with Uber Eats" />
                                    
                                </div>
                            </div>
                            <div v-if="this.currentStore.events">
                                <h3 class="store_details_title">Current Events</h3>
                                <div class="row margin_40">
                                    <div class="col-md-6" v-if="storeEvents" v-for="item in storeEvents">
                                        <div class="feature_item_container">
                                	        <router-link class="tile" :to="{ name: 'eventDetails', params: { id: item.slug }}">
                                    			<img :src="item.image_url" :alt="item.name">
                                				<div class="details">
                        					    	<span class="title">
                        					            <h3>{{ item.name }}</h3>
                    					            </span>
                            					    <span class="info">
                        					            <p><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
                        					            <p>View Promotion Details <i class="fa fa-angle-double-right" aria-hidden="true"></i></p>
                    					            </span>
                                				</div>
                                    		</router-link>
                                	    </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="this.currentStore.promotions">
                                <h3 class="store_details_title">Current Promotions</h3>  
                                <div class="row margin_40">
                                    <div class="col-md-6" v-if="storePromotions" v-for="item in storePromotions">
                                        <div class="feature_item_container">
                                	        <router-link class="tile" :to="{ name: 'promotionDetails', params: { id: item.slug }}">
                                    			<img :src="item.image_url" :alt="item.name">
                                				<div class="details">
                        					    	<span class="title">
                        					            <h3>{{ item.name }}</h3>
                    					            </span>
                            					    <span class="info">
                        					            <p><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
                        					            <p>View Promotion Details <i class="fa fa-angle-double-right" aria-hidden="true"></i></p>
                    					            </span>
                                				</div>
                                    		</router-link>
                                	    </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="this.currentStore.coupons">
                                <h3 class="store_details_title">Current Coupons</h3> 
                                <div class="row margin_40">
                                    <div class="col-md-6" v-if="storeCoupons" v-for="item in storeCoupons">
                                        <div class="feature_item_container">
                                	        <router-link class="tile" :to="{ name: 'couponDetails', params: { id: item.slug }}">
                                    			<img :src="item.image_url" :alt="item.name">
                                				<div class="details">
                        					    	<span class="title">
                        					            <h3>{{ item.name }}</h3>
                    					            </span>
                            					    <span class="info">
                        					            <p><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
                        					            <p>View Promotion Details <i class="fa fa-angle-double-right" aria-hidden="true"></i></p>
                    					            </span>
                                				</div>
                                    		</router-link>
                                	    </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row margin_60">
                                <div class="col-md-12">
                		            <router-link class="pull-right" to="/stores">
                		                <div class="animated_btn store_details_btn">Back to Directory</div>    
                		            </router-link>
                		        </div>
                		    </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
    .mapplic-popup-link {
        display: none !important;
    }
</style>

<script>
    define(["Vue", "vuex", "moment", "vue!mapplic-png-map"], function (Vue, Vuex, moment, MapplicComponent) {
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function () {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentStore: null,
                    storeHours: null,
                    map: null,
                    storeEvents: null,
                    storePromotions: null,
                    storeCoupons: null
                }
            },
            props:['id'],
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Directory Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5d7017836e6f641aaf4f0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                
                    this.updateCurrentStore(this.id);
                    this.dataLoaded = true;
                });
            },
            watch: {
                $route: function () {
                    this.updateCurrentStore(this.$route.params.id);
                },
                currentStore: function () {
                    this.currentStore.zoom = 2;
                    
                    if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
                        this.currentStore.no_logo = true
                    } else {
                        this.currentStore.no_logo = false
                    }
                    
                    var vm = this;
                    var storeHours = [];
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        hours = vm.findHourById(value)
                        today = moment().day();
                        if( today == hours.day_of_week ){
                            hours.todays_hours = true;
                        } else {
                            hours.todays_hours = false;
                        }
                        storeHours.push(hours);
                    });
                    this.storeHours = _.sortBy(storeHours, function(o) { return o.day_of_week });
                    
                    // DELIVERY
                    var delivery_category = 8245;
                    var categories = this.currentStore.categories;
                    var subcategories = this.currentStore.subcategories;
                    console.log(subcategories)
                    if (_.includes(categories, delivery_category) && !_.isEmpty(subcategories)) {
                        this.deliveryAvailable = true;
                        if (_.includes(subcategories, 8250)) {
                            this.hasUberEats = true;
                        }
                        if (_.includes(subcategories, 8246)) {
                            this.hasDoordash = true;
                        }
                        // if (_.includes(subcategories, 8247)) {
                        //     this.hasGrubhub = true;
                        // }
                        if (_.includes(subcategories, 8248)) {
                            this.hasPostmates = true;   
                        }
                        if (_.includes(subcategories, 8249)) {
                            this.hasRestaurantDelivery = true;   
                        }
                    }
                
                    var vm = this;
                    var temp_promo = [];
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        
                        if (_.includes(current_promo.image_url, 'missing')) {
                            current_promo.image_url = "//codecloud.cdn.speedyrails.net/sites/5d7017836e6f641aaf4f0000/image/png/1529532181000/promoplaceholder2@2x.png";
                        }

                        temp_promo.push(current_promo);
                    }); 
                    this.storePromotions = temp_promo;

                    var vm = this;
                    var temp_event = [];
                    _.forEach(this.currentStore.events, function(value, key) {
                        var current_event = vm.findEventById(value);
                        
                        if (_.includes(current_event.image_url, 'missing')) {
                            current_event.image_url = "//codecloud.cdn.speedyrails.net/sites/5d7017836e6f641aaf4f0000/image/png/1529532187000/eventsplaceholder2@2x.png";
                        }

                        temp_event.push(current_event);
                    }); 
                    this.storeEvents = temp_event;
                    
                    var vm = this;
                    var temp_coupon = [];
                    _.forEach(this.currentStore.coupons, function(value, key) {
                        var current_coupon = vm.findCouponById(value);
                        // if (_.includes(current_coupon.image_url, 'missing')) {
                        //     current_coupon.image_url = "http://placehold.it/1560x800/757575";
                        // }

                        temp_coupon.push(current_coupon);
                    }); 
                    // this.storeCoupons = temp_coupon;
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'findStoreBySlug',
                    'findRepoByName',
                    'findHourById',
                    'findPromoById',
                    'findEventById',
                    'findCouponById'
                ]),
                getPNGurl () {
                    return "https://www.mallmaverick.com" + this.property.map_url;
                },
                pngMapRef() {
                    return this.$refs.pngmapref;
                },
                allStores() {
                    this.processedStores.map(function(store){
                        store.zoom = 1;
                    })
                    return this.processedStores;
                },
                floorList () {
                    var floor_list = [];
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.getPNGurl;
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    return floor_list;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "stores"), this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData","events"), this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData","coupons")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore(id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined) {
                        this.$router.replace({ name: 'stores' });
                    }
                    this.$breadcrumbs[1].meta.breadcrumb = this.currentStore.name
                },
                updatePNGMap(map) {
                    this.map = map;
                    this.dropPin(this.currentStore);
                },
                dropPin(store) {
                    this.$refs.pngmap_ref.showLocation(store.id);
                },
                isMultiDay(item) {
                    var timezone = this.timezone
                    var start_date = moment(item.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(item.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        });
    });
</script>