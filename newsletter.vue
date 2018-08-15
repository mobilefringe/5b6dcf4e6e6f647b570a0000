<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Newsletter</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                            <div v-if="pageContent" v-html="pageContent.body"></div>
                            <form class="newsletter_form form-horizontal" action="//mobilefringe.createsend.com/t/d/s/ejdhrl/" method="post">
                                <div class="row">
                                    <div class="col-sm-6" >
                                        <label for="fieldfihudt" class="accessibility">First Name</label>
                                        <input v-model="form_data.first_name" required class="margin_20 form-control" id="fieldzhtulk" name="cm-f-zhtulk" type="text" placeholder="First Name">
                                    </div>
                                    <div class="col-sm-6" >
                                        <label for="fieldzhtulk" class="accessibility">Last Name</label>
                                        <input v-model="form_data.last_name" required class="margin_20 form-control" id="fieldzhtulk" name="cm-f-zhtulk" type="text" placeholder="Last Name">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <label for="newsletter_email" class="accessibility">Email</label>
                                        <input v-model="form_data.email" required class="margin_20 form-control" name="cm-ejdhrl-ejdhrl" type="email" placeholder="Email" id="newsletter_email">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div style="margin-left: 20px">
                                            <label class="checkbox">
                                                <input name="agree_newsletter" required  type="checkbox">
                                                I agree to receive communications from {{ property.name }}.
                                            </label>
                                        </div>
            					    </div>
            					</div>
        					    <div class="margin_40 clearfix"></div>
        					    <div class="row">
                                    <div class="col-xs-12">
                                        <button class="animated_btn" type="submit" :disabled="formSuccess">Subscribe</button>
                                    </div>
                                </div>
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "jquery", "vee-validate", "json!site.json"], function(Vue, Vuex, $, VeeValidate, site) {
        Vue.use(VeeValidate);
        return Vue.component("newsletter-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: true,
                    pageBanner: null,
                    pageContent: null,
                    siteInfo: site,
                    form_data : {},
                    formSuccess : false,
                    formError: false
                }
            },
            mounted () {
                this.form_data.first_name = this.$route.query.name;
                $("#fieldfihudt").val(this.form_data.first_name);
                this.form_data.email = this.$route.query.email;
                $("#newsletter_email").val(this.form_data.email);
            },
            watch : {
                $route () {
                    this.form_data.first_name = this.$route.query.name;
                    $("#fieldzhtulk").val(this.form_data.first_name);
                    this.form_data.email = this.$route.query.email;
                    $("#newsletter_email").val(this.form_data.email);
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Newsletter Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b6dcf4e6e6f647b570a0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                    
                    this.pageContent = response[0].data;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'findRepoByName'
                ])
            },
            methods: {
                loadData: async function () {
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/eastwashington-newsletter.json"}), this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>