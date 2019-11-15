<template>
    <div><!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
            <image-popup-component></image-popup-component>
                <div class="home_banner_container">
                    <div class="prev"></div>
                    <slick ref="slick" :options="slickOptions">
                        <div v-if="homeBanners" v-for="banner in homeBanners">
                            <div v-if="banner.name && banner.description" class="banner_height">
                                <div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>
                                <div class="banner_content_container">
                                    <div class="banner_content">
                                        <span v-if="banner.heading" class="banner_heading">{{ banner.heading }}</span>
                                        <h1 class="banner_title">{{ banner.name }}</h1>
                                        <p class="banner_text">{{ banner.description }}</p>
                                        <a :href="banner.url">
                                            <span class="banner_btn animated_btn">Find Out More</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <a :href="banner.url" :aria-label="banner.name">
                                    <div class="banner_image" v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"></div>
                                </a>
                            </div>
                        </div>
                    </slick>
                    <div class="next"></div>
                </div>
                <messages-component></messages-component>
                <div class="main_container">
                    <h2 v-if="featuredItems.length > 0" class="home_title center">Events & Promotions</h2>
                    <div v-if="featuredItems.length > 0" class="row margin_40 home_events">
                        <div class="col-sm-4" v-for="item in featuredItems">
                    	    <div v-if="item.eventable_type" class="feature_item_container">
                    	        <router-link class="tile" :to="{ name: 'eventDetails', params: { id: item.slug }}">
                        			<img :src="item.image_url" :alt="'Event: ' + item.name">
                    				<div class="details">
            					    	<span class="title">
            					            <h3>{{ item.name }}</h3>
        					            </span>
                					    <span class="info">
            					            <p><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} to {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
            					            <p>View Event Details <i class="fa fa-angle-double-right" aria-hidden="true"></i></p>
        					            </span>
                    				</div>
                        		</router-link>
                    	    </div>
                    	    <div v-if="item.promotionable_id" class="feature_item_container">
                    	        <router-link class="tile" :to="{ name: 'promotionDetails', params: { id: item.slug }}">
                        			<img :src="item.image_url" :alt="'Promotion: ' + item.name">
                    				<div class="details">
            					    	<span class="title">
            					            <h3>{{ item.name }}</h3>
        					            </span>
                					    <span class="info">
            					            <p><span v-if="isMultiDay(item)">{{ item.start_date | moment("MMMM D", timezone)}} to {{ item.end_date | moment("MMMM D", timezone)}}</span><span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span></p>
            					            <p>View Promotion Details <i class="fa fa-angle-double-right" aria-hidden="true"></i></p>
        					            </span>
                    				</div>
                        		</router-link>
                    	    </div>
                        </div>
                    </div>
                    <h2 v-if="instaFeed" class="home_title center">In Our Feed</h2>
                    <div v-if="instaFeed" class="row hidden-xs margin_60">
                        <div class="col-md-8 col-md-offset-2">
                            <div class="insta-feed-container">
                                <div class="insta-feed-image " v-for="(item, index) in instaFeed">
                                    <a :href="item.link" target="_blank">
                                        <div class="insta-img" v-bind:style="{ 'background-image': 'url(' + item.images.standard_resolution.url + ')' }"></div>
                                        <div class="insta_content">
                                            <p class="insta_caption">{{ item.caption.text }}</p>
                                            <p class="insta_user">@{{ item.user.username }}</p>
                                            <i class="insta_icon fab fa-instagram"></i>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="visible-xs margin_60 insta-feed-container">
                        <div class="insta_prev"></div>
                        <slick ref="slick" :options="instaOptions">
                            <div class="insta-feed-image " v-for="(item, index) in instaFeed">
                                <a :href="item.link" target="_blank">
                                    <div class="insta-img" v-bind:style="{ 'background-image': 'url(' + item.images.standard_resolution.url + ')' }"></div>
                                    <div class="insta_content">
                                        <p class="insta_caption">{{ item.caption.text }}</p>
                                        <p class="insta_user">@{{ item.user.username }}</p>
                                        <i class="insta_icon fab fa-instagram"></i>
                                    </div>
                                </a>
                            </div>
                        </slick>
                        <div class="insta_next"></div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-meta", "vue!vue-slick", "moment", "moment-timezone", "vue-moment", "vue!welcome_msg", "vue!image_popup.vue"], function (Vue, Vuex, Meta, slick, moment, tz, VueMoment, welcomeMessage, imagePopup) {
        return Vue.component("home-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    slickOptions: {
                        adaptiveHeight: true,
                        arrows: true,
                        autoplay: true,
                        autoplaySpeed: 9000,
                        cssEase: 'linear',
                        dots: true,
                        fade: true,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1000,
                        nextArrow: '.next',
                        prevArrow: '.prev',
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    pauseOnFocus: false,
                                    pauseOnHover: false,
                                    swipe : false,
                                    waitForAnimate : false
                                },
                                breakpoint: 480,
                                settings: {
                                    pauseOnFocus: false,
                                    pauseOnHover: false,
                                    swipe : false,
                                    waitForAnimate : false
                                }
                            }
                        ]
                    },
                    instaOptions: {
                        arrows: true,
                        autoplay: true,
                        autoplaySpeed: 8000,
                        cssEase: 'linear',
                        dots: false,
                        fade: true,
                        infinite: true,
                        slidesToShow: 1,
                        speed: 1000,
                        nextArrow: '.insta_next',
                        prevArrow: '.insta_prev'
                    },
                    instaFeed: null
                }
            },
            created(){
                this.loadData().then(response => {
                    var socialFeed = response[3].data;
                    var social_feed = socialFeed.social.instagram;
                    this.instaFeed = _.slice(social_feed, [0], [6]);
                    this.instaFeed.map(insta => {
                        if(insta.caption != null){
                            insta.caption.text = _.truncate(insta.caption.text, { 'length': 60, 'separator': ' ' });
                        }
                    });
                    
                    this.dataLoaded = true;  
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'processedPromos',
                    'processedEvents',
                    'findMetaDataByPath'
                ]),
                homeBanners() {
                    var banners = [];
                    _.forEach(this.$store.state.banners, function (value, key) {
                        var today = new Date();
                        var start = new Date (value.start_date);
                        if (start <= today){
                            if (value.end_date){
                                var end = new Date (value.end_date);
                                if (end >= today){
                                    banners.push(value);  
                                }
                            } else {
                                banners.push(value);
                            }
                            
                            if (value.cms_fields.subheader) {
                                value.heading = value.cms_fields.subheader;
                            }
                        }
                    });
                    banners = _.orderBy(banners, function(o) { return o.position });
                    return banners
                },
                featuredItems() {
                    var promotions = [];
                    var featured_promotions = [];
                    var regular_promotions = [];
                    _.forEach(this.processedPromos, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (_.includes(value.promo_image_url_abs, 'missing')) {
                                if (value.store != null && value.store != undefined) {
                                    if (_.includes(value.store.store_front_url_abs, 'missing')) {
                                        value.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/jpeg/1537463505000/ewp_promo-compressor.jpg";
                                    } else {
                                        value.image_url = value.store.store_front_url_abs;
                                    }
                                } else {
                                    value.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/jpeg/1537463505000/ewp_promo-compressor.jpg";
                                }
                            }
                            
                            // Sort Featured Promotions
                            if (value.is_featured) {
                                featured_promotions.push(value);
                            } else {
                                regular_promotions.push(value);
                            }
                            
                            if (featured_promotions.length >= 2) {
                                promotions = _.sortBy(featured_promotions, function(o) { return o.feature_item_index });
                            } else {
                                regular_promotions = _.sortBy(regular_promotions, function(o) { return o.show_on_web_date });
                                promotions = _.concat(featured_promotions, regular_promotions);
                            }
                            promotions = _.slice(promotions, [0], [2]);
                        }
                    });
                    var events = [];
                    var featured_events = [];
                    var regular_events = [];
                    _.forEach(this.processedEvents, function(value, key) {
                        var today = moment.tz(this.timezone).format();
                        var showOnWebDate = moment.tz(value.show_on_web_date, this.timezone).format();
                        if (today >= showOnWebDate) {
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/jpeg/1537463477000/ewp-events-compressor.jpg";
                            }
                            // Sort Featured Events
                            if (value.is_featured) {
                                featured_events.push(value);
                            } else {
                                regular_events.push(value);
                            }
                            
                            if (featured_events.length >= 2) {
                                events = _.sortBy(featured_events, function(o) { return o.feature_item_index });
                            } else {
                                regular_events = _.sortBy(regular_events, function(o) { return o.show_on_web_date });
                                events = _.concat(featured_events, regular_events);
                            }
                            events = _.slice(events, [0], [1]);  
                        }
                    });
                    var feature_items = _.concat(promotions, events)
                    feature_items = _.orderBy(feature_items, function(o) { return o.feature_item_index });

                    return feature_items
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "banners"), this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData", "events"), this.$store.dispatch('LOAD_PAGE_DATA', {url: "https://eastwashington.mallmaverick.com/api/v4/eastwashington/social.json"})]);
                        // Add in for Instagram Feed
                        // this.$store.dispatch('LOAD_PAGE_DATA', {url: "https://eastwashington.mallmaverick.com/api/v4/eastwashington/social.json"})
                        return results;
                    } catch(e) {
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
                }
            }
        })
    })
</script>