<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_page_header" v-if="pageBanner" v-bind:style="{ background: 'linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(' + pageBanner.image_url + ') center center' }">
                    <div class="main_container position_relative">
                        <h2>Contest</h2>
                    </div>
                </div>
                <div class="main_container">
                    <div class="row">
                        <div class="col-md-12">
                            <breadcrumb></breadcrumb>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <img v-if="currentContest.image_url" class="img_max" :src="currentContest.image_url" :alt="currentContest.name">
                        </div>
                    </div> 
                    <div class="row"> 
                        <div class="col-md-8 col-md-offset-2">
    						<h3 v-if="currentContest.name" class="contest_title">{{currentContest.name}}</h3>
                            <div v-if="currentContest.rich_description" class="contest_desc" v-html="currentContest.rich_description"></div>
                            <transition name="fade">
                                <div>
                                    <div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccess">
                                        <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                        <span class="sr-only">Success</span>
                                        Good luck and thank you for entering our contest.
                                    </div>
                                    <div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formError">
                                        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                        <span class="sr-only">Error:</span>
                                        There was an error when trying to submit your request. Please try again later.
                                    </div>
                                </div>
                            </transition>
                            <form id="contest_form" class="form-horizontal clearfix" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
        						<div class="form-group ">
        							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('first_name')}">
        								<label class="accessibility" for="first_name">First Name</label>
        								<input v-model="form_data.first_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="first_name" type="text" placeholder="First Name" data-vv-delay="500" data-vv-as="first name" required>
        								<span v-show="errors.has('first_name')" class="form-control-feedback">{{ errors.first('first_name') }}</span>
        							</div>
        							<div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('last_name')}">
        								<label class="accessibility" for="last_name">Last Name</label>
        								<input v-model="form_data.last_name" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="last_name" type="text" placeholder="Last Name" data-vv-delay="500" data-vv-as="last name">
        								<span v-show="errors.has('last_name')" class="form-control-feedback">{{ errors.first('last_name') }}</span>
        							</div>
        						</div>
        						<div class="form-group">
        							<div class="col-xs-12" :class="{'has-error': errors.has('email')}">
        								<label class="accessibility" for="email">Email</label>
        								<input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" placeholder="Email" data-vv-delay="500" data-vv-as="email">
        								<span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
        							</div>
        						</div>
        						<div class="form-inline row margin_40">
        						    <div class="col-xs-12">
        						        <label class="checkbox">
                                            <input name="agree_terms" type="checkbox" required >
                                            I am over the age of 18.
                                        </label>
        						    </div>
        						    <div class="col-xs-12" :class="{'has-error': errors.has('agree_newsletter')}">
        						        <label class="checkbox">
                                            <input name="agree_newsletter" required type="checkbox" v-model="form_data.newsletter">
                                                I agree to receive newsletters from {{ property.name }}. (You can unsubscribe at anytime)
                                        </label>
        						    </div>
        						    <div class="col-xs-12">
        						        <p>For more details about personal privacy, please read our <a href="" target="_blank">Privacy Policy</a>.</p>
                                    </div>
                                </div>
                                <div class="form-group">
        							<div class="col-xs-12 margin_60">
        								<button class="animated_btn" type="submit" :disabled="formSuccess">Submit</button>
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
    define(["Vue", "vuex", "jquery", "axios", "vee-validate"], function(Vue, Vuex, $, axios, VeeValidate) {
        Vue.use(VeeValidate);
        return Vue.component("contest-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    form_data: {},
                    formSuccess: false,
                    formError: false,
                    validaNum: '',
                    correctValNum: null,
                    validNumError: false,
                    currentContest: null
                }
            },
            created() {
                this.$store.dispatch("getData", "repos").then(response => {
                    var temp_repo = this.findRepoByName('Events Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b6dcf4e6e6f647b570a0000/image/jpeg/1529532304000/insidebanner2.jpg"
                        }
                    }
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                }); 
                
                this.$store.dispatch("getData", "contests").then(response => {
                    this.currentContest = this.findContestByShowOnSlug(''); // Add Contest URL
                    this.dataLoaded = true;
                }, error => {
                    console.error("Could not retrieve data from server. Please check internet connection and try again.");
                });
            },
            watch : {
                formSuccess() {
                    setTimeout(function(){
                        console.log($("#send_contact_success"), $("#send_contact_success").offset());
                        var position = $("#send_contact_success").offset().top - 250;
                        $('html, body').animate({
                    		scrollTop: position
                    	}, 500, 'linear');
                    }, 700)
                }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'findContestBySlug',
                    'findContestByShowOnSlug'
                ]),
            },
            methods: {
                validateBeforeSubmit() {
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            let errors = this.errors;
                            //format contests data for MM
                            var contest_entry = {};
                            contest_entry.contest = this.form_data;
                            var vm = this;
                            host_name = this.property.mm_host.replace("http:", "");
                            var url = host_name + "/contests/" + this.currentContest.slug + "/create_js_entry";
                            $.ajax({
                                url: url,
                                type: "POST",
                                data: contest_entry,
                                success: function(data) {
                                    vm.formSuccess = true;
                                },
                                error: function(data){
                                    vm.formError = true;
                                }
                            });
                        }
                    })
                }
            }
        });
    });
</script>