<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), #000 url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h1>Delivery</h1>
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
        		            <button class="animated_btn stores_btn" @click="toggleView()">{{ toggleText }}</button>
        		            <router-link to="/map">
        		                <div class="animated_btn stores_btn">
        		                    Center Map
        		                </div>    
        		            </router-link>
        		        </div>
        		        <div class="col-md-6 clearfix">
        		            <div class="store_search">
            					<search-component :list="allStores" placeholder="Search" suggestion-attribute="name" v-model="search_result" @select="onOptionSelect" class="text-left">
            						<template slot="item" scope="option" class="manual">
            							<article class="media">
            								<p>{{ option.data.name }}</p>
            							</article>
            						</template>
            					</search-component>
            					<i class="fa fa-search"></i>
            				</div> 
            				<div class="store_category">
            					<v-select 
            					    v-model="selectedCat" 
            					    :options="dropDownCats" 
            					    :searchable="false" 
            					    :on-change="filterByCategory" 
            					    class="category-select" 
            					    placeholder="Category" 
            					    id="selectByCat"
            				    ></v-select>
            				</div>
        		        </div>
        		    </div>
        			<!-- Logo View -->
        			<div v-if="logoView" class="margin_60">
            			<div v-masonry transition-duration="0.3s" item-selector=".stores-grid-item" horizontal-order="true">
                            <transition-group name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div">
                                <div v-masonry-tile  v-for="(store, index) in filteredStores" :key="index" class="stores-grid-item">
                            	    <div class="store_logo_container">
                            	        <router-link :to="'/stores/'+ store.slug">
                                			<div v-if="!store.no_store_logo">
                                			    <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                                			    <img  class="store_img" :src="store.store_front_url_abs" :alt="store.name + 'Logo'">
                                			</div>
                                			
                                            <div v-else class="no_logo_container">
                                                <img class="transparent_logo" src="//codecloud.cdn.speedyrails.net/sites/5b1550796e6f641cab010000/image/png/1536094421888/default_background.png" alt="">
                                                <div class="no_logo_text">
                                                    <div class="store_text"><h2>{{ store.name }}</h2></div>
                                                </div>
                                            </div>
                                			<div class="store_tag" v-if="store.total_published_promos">
            									<div class="store_tag_text">Promotion</div>
            								</div>
            								<div class="store_tag" v-if="!store.total_published_promos && store.is_coming_soon_store">
            									<div class="store_tag_text">Coming Soon</div>
            								</div>
            								<div class="store_tag" v-if="!store.total_published_promos && !store.is_coming_soon_store && store.is_new_store">
            									<div class="store_tag_text">New Store</div>
            								</div>
            								<div class="store_details">
            								    <div class="store_text"><h2>{{ store.name }}</h2></div>    
            								</div>
                                		</router-link>
                            	    </div>
                                </div>
                            </transition-group>
                        </div>
                    </div>
                    <!-- List View -->
                    <div v-if="listView" class="margin_60 listView">
                        <transition-group name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div">
                            <div v-for="(store, index) in filteredStores" :key="index">
                    			<div class="store_name">
                    			    <router-link :to="'/stores/'+ store.slug">
                    			        <p>{{ store.name }}</p>
                    			    </router-link>
                    			</div>
                            </div>
                        </transition-group>
                    </div>
        		</div>
	        </div>
	    </transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "vue-select", "vue!search-component", "masonry" , "vue-masonry-plugin"], function(Vue, Vuex, VueSelect, SearchComponent, masonry, VueMasonryPlugin) {
        Vue.component('v-select', VueSelect.VueSelect);
        Vue.use(VueMasonryPlugin.default);
        return Vue.component("delivery-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner : null,
                    windowWidth: 0,
                    selectedCat: null,
                    filteredStores: null,
                    search_result : null,
                    query: "",
                    toggleText: "Display as List",
                    logoView: true,
                    listView: false,
                    deliveryFilter: 8245
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Dine Banner');
                    if (temp_repo !== null && temp_repo !== undefined) {
                       temp_repo = temp_repo.images;
                       this.pageBanner = temp_repo[0];
                    } else {
                         this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                    this.dataLoaded = true;
                });
            },
            watch: {
                selectedCat: function() {
                    this.$nextTick(function() {
                        Vue.prototype.$redrawVueMasonry();
                    });    
                }
            },
            mounted() {
                this.$nextTick(function() {
                    window.addEventListener('resize', this.getWindowWidth);
                    //Init
                    this.getWindowWidth();
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'processedStores',
                    'processedCategories',
                    'processedSubcategories',
                    'storesByAlphaIndex',
                    'storesByCategoryName',
                    'findCategoryById',
                    'findCategoryByName',
                    'findSubcategoryById',
                    'findSubcategoryByName',
                    'findSubcategoriesByParentID',
                    'findRepoByName'
                ]),
                allStores() {
                    var store_list = [];
                    var vm = this;
                    _.forEach(this.processedStores, function(value, key) {
                        if (_.includes(value.categories, vm.deliveryFilter)) {
                            if (_.includes(value.image_url, 'missing')) {
                                value.image_url = vm.property.default_logo;
                            }
                            store_list.push(value);
                        }
                    });
                    this.filteredStores = store_list;
                    return store_list
                },
                dropDownCats() {
                    var vm = this;
                    var delivery_cat =  _.find(this.processedCategories, function(o) { return o.name == "Delivery"});
                    var subcategories = [];
                    if (delivery_cat !== null && delivery_cat !== undefined) {
                       subcategories = vm.findSubcategoriesByParentID(delivery_cat.id);
                    }
                    subcategories = _.filter(subcategories, function(o) { return o.store_ids !== null});
                    subcategories = _.map(subcategories, 'name').sort();
                    subcategories.unshift('All Cuisine');
                    return subcategories;
                },
                filterByCategory() {
                    category_id = this.selectedCat;
                    if (category_id == "All Cuisine" || category_id == null || category_id == undefined) {
                        category_id = "All";
                    } else {
                        category_id = this.findSubcategoryByName(category_id).id;
                    }

                    if (category_id == "All") {
                        this.filteredStores = this.allStores;
                    } else {
                        var find = this.findSubcategoryById;
                        var filtered = _.filter(this.allStores, function(o) {
                            return _.indexOf(o.subcategories, _.toNumber(category_id)) > -1;
                        });
                        this.filteredStores = filtered;
                    }
                    var el = document.getElementById("selectByCat");
                    if(el) {
                        el.classList.remove("open");
                    }
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([
                            this.$store.dispatch("getData", "categories"), 
                            this.$store.dispatch("getData", "repos"), 
                            this.$store.dispatch("getData", "subcategories")
                        ]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                toggleView() {
                    if (this.logoView) {
                        this.toggleText = "Display as Logos"
                        this.listView = true;
                        this.logoView = false;
                    } else if (this.listView) {
                        this.toggleText = "Display as List"
                        this.logoView = true;
                        this.listView = false;
                    } 
                },
                getWindowWidth(event) {
                    this.windowWidth = window.innerWidth;
                },
                onOptionSelect(option) {
                    this.search_result = "";
                    this.$router.push("/stores/" + option.slug);
                }
            },
            beforeDestroy: function() {
                window.removeEventListener('resize', this.getWindowWidth);
            }
        });
    });
</script>