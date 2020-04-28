<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center rgb(49, 55, 113)' }">
                    <div class="main_container position_relative">
                        <h1>Center Map</h1>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row margin_60">
                        <div class="col-md-3 padding_60">
                            <h5 class="store_list_title margin_20">Select a Category</h5>
                            <div class="map_category">
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
                            <div class="map_search">
                                <search-component 
                                    v-model="storeSearch" 
                                    :list="processedStores" 
                                    :suggestion-attribute="suggestionAttribute" 
                                    @select="onOptionSelect" 
                                    :threshold="1"
                                >
                                    <template slot="item" scope="option">
                                        <article class="media">
                                            <p>{{ option.data.name }}</p>
                                        </article>
                                    </template>
                                </search-component>
                                <i id="store-search-icon" class="fa fa-search" aria-hidden="true"></i>
                            </div>
                            <div tabindex=0 class="store_list_container" v-if="filteredStores">
                                <p tabindex=0 class="store_name" v-for="store in filteredStores" v-on:focus="dropPin(store)" v-on:click="dropPin(store)">{{store.name}}</p>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <mapplic-png-map ref="pngmap_ref" :height="664" :hovertip="true" :storelist="allStores" :floorlist="floorList" :bindLocationOpened="true" :svgWidth="property.map_image_width" :svgHeight="property.map_image_height" :showPin="true" tooltiplabel="View Store Details"></mapplic-png-map>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-select", "vue!search-component", "vue!mapplic-png-map"], function(Vue, Vuex, VueSelect, SearchComponent, MapplicComponent) {
        Vue.component('v-select', VueSelect.VueSelect);
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    selectedCat: null,
                    filteredStores: null,
                    suggestionAttribute: "name",
                    storeSearch: null,
                    currentSelection: null,
                    dineFilter: 5962
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Map Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5dcdc95e6e6f6403ca060000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                    
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName',
                    'processedStores',
                    "processedCategories",
                    "storesByCategoryName",
                    'findCategoryByName'
                ]),
                allStores() {
                    this.processedStores.map(function(store){
                        store.zoom = 1;
                    })
                    return this.processedStores;
                },
                allCatergories() {
                    return this.processedCategories;
                },
                dropDownCats() {
                    var cats = _.filter(this.processedCategories, function(o) { return o.name != "Dine Filter"; });
                    cats = _.map(cats, 'name');
                    cats.unshift('All');
                    return cats;
                },
                filterByCategory() {
                    category_id = this.selectedCat;
                    if (category_id == "All" || category_id == null || category_id == undefined) {
                        category_id = "All";
                    } else {
                        category_id = this.findCategoryByName(category_id).id;
                    }
                    if (category_id == "All") {
                        this.filteredStores = this.allStores;
                    } else {
                        var find = this.findCategoryById;
                        var filtered = _.filter(this.allStores, function(o) {
                            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
                        });
                        this.filteredStores = filtered;
                    }
                    var el = document.getElementById("selectByCat");
                    if(el) {
                        el.classList.remove("open");
                    }
                },
                getPNGurl() {
                    return "//assets.mallmaverick.com" + this.property.map_url;
                },
                pngMapRef() {
                    return this.$refs.pngmap_ref;
                },
                floorList () {
                    var floor_list = [];
                    
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Floor 1";
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
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                dropPin(store) {
                    this.pngMapRef.showLocation(store.id);
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.storeSearch = ""
                    });
                    this.pngMapRef.showLocation(option.id);
                }
            }
        });
    });
</script>