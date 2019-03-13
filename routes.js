define([], function () {
    return [
        {
            path: '/',
            component: view('home')
        },
        {
            path: '/center-information',
            component: view('default'),
            // meta: {
            //     breadcrumb: 'Center Information'
            // },
            children: [
                {   
                    path: '',
                    component: view('center_information'),
                    name: 'center-info'
                },
                {
                    path: '/contact-us',
                    component: view('default'),
                    children: [
                        {
                            path: '',
                            component: view('contact'),
                            meta: {
                                breadcrumb: 'Contact Us'
                            },
                            name: 'contact'
                        }
                    ]
                },
                {
                    path: '/leasing',
                    component: view('default'),
                    children: [
                        {
                            path: '',
                            component: view('leasing'),
                            meta: {
                                breadcrumb: 'Leasing'
                            },
                            name: 'leasing'
                        }
                    ]
                },
                {
                    path: '/newsletter',
                    component: view('default'),
                    children: [
                        {
                            path: '',
                            component: view('newsletter'),
                            meta: {
                                breadcrumb: 'Newsletter Sign-Up',
                            },
                            name: 'newsletter'
                        }
                    ]
                },
            ]
        },
        {
            path: '/contest',
            component: view('default'),
            meta: {
                breadcrumb: 'Contest',
            },
            children: [
                {
                    path: '',
                    component: view('contest'),
                    name: 'contest'
                }
            ]
        },
        // {
        //     path: '/events',
        //     // component: view('default'),
        //     meta: {
        //         breadcrumb: 'Events & Promotions',
        //     },
        //     children: [
        //         {
        //             path: ':id',
        //             component: view('event_details'),
        //             meta: {
        //                 breadcrumb: 'Event Details',
        //             },
        //             name: 'eventDetails',
        //             props: true
        //         }
        //     ]
        // },
        {
            path: '/events-and-promotions',
            component: view('default'),
            meta: {
                breadcrumb: 'Events & Promotions',
            },
            children: [
                {
                    path: '',
                    component: view('events_and_promotions'),
                    name: 'events_and_promotions'
                },
                {
                    path: '/events/:id',
                    component: view('event_details'),
                    meta: {
                        breadcrumb: 'Event Details',
                    },
                    name: 'eventDetails',
                    props: true
                },
                {
                    path: '/promotions/:id',
                    component: view('promotion_details'),
                    meta: {
                        breadcrumb: 'Promotion Details',
                    },
                    name: 'promotionDetails',
                    props: true
                }
            ]
        },
        {
            path: '/location',
            component: view('default'),
            meta: {
                breadcrumb: 'Location'
            },
            children: [
                {   
                    path: '',
                    component: view('location'),
                    name: 'location'
                }
            ]
        },
        {
            path: '/pages',
            component: view('default'),
            children: [
                {
                    path: ':id',
                    component: view('page_details'),
                    meta: {
                        breadcrumb: 'Page Details',
                    },
                    name: 'pageDetails',
                    props: true
                }
            ]
        },
        // {
        //     path: '/promotions',
        //     component: view('default'),
        //     meta: {
        //         breadcrumb: 'Events & Promotions',
        //     },
        //     children: [
        //         {
        //             path: ':id',
        //             component: view('promotion_details'),
        //             meta: {
        //                 breadcrumb: 'Promotion Details',
        //             },
        //             name: 'promotionDetails',
        //             props: true
        //         }
        //     ]
        // },
        {
            path: '/stores',
            component: view('default'),
            meta: {
                breadcrumb: 'Directory',
            },
            children: [
                {   
                    path: '',
                    component: view('stores'),
                    name: 'storeList'
                },
                {
                    path: ':id',
                    component: view('store_details'),
                    meta: {
                        breadcrumb: 'Store Details',
                    },
                    name: 'storeDetails',
                    props: true
                },
                {
                    path: '/dine',
                    component: view('default'),
                    children: [
                        {   
                            path: '',
                            component: view('dine'),
                            meta: {
                                breadcrumb: 'Dining',
                            },
                            name: 'dine'
                        }
                    ]
                },
                {
                    path: '/map',
                    component: view('default'),
                    children: [
                        {   
                            path: '',
                            component: view('map'),
                            meta: {
                                breadcrumb: 'Centre Map',
                            },
                            name: 'map'
                        }
                    ]
                }
            ]
        },
        {
            path: '*',
            redirect: '/'
        }
    ]

    /*
    * Asynchronously load view (lazy-loading)
    * @param {string} name the filename (basename) of the view to load.
    */
    function view(name) {
        return function(resolve) { require(['vue!' + name + '.vue'], resolve); }
    }
});
