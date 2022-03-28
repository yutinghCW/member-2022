import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
let that = null;
const app = createApp({
    data() {
        return {
            user: {
                uid: '',
                name: '',
                email: '',
            },
            challenge: {
                read: false,
                learn: false,
                book: false,
            },
            webaccess: {
                hsieh: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://dev-www.cw.com.tw/dev-member-2022/assets/audio/webaccess_hsieh.mp3',
                    }),
                },
                ding: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://dev-www.cw.com.tw/dev-member-2022/assets/audio/webaccess_ding.mp3',
                    }),
                },
                sun: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://dev-www.cw.com.tw/dev-member-2022/assets/audio/webaccess_sun.mp3',
                    }),
                },
                hua: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://dev-www.cw.com.tw/dev-member-2022/assets/audio/webaccess_hua.mp3',
                    }),
                },
                liu: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://dev-www.cw.com.tw/dev-member-2022/assets/audio/webaccess_liu.mp3',
                    }),
                },
                tsai: {
                    state: false,
                    finished: false,
                    player: new Howl({
                        src: 'https://dev-www.cw.com.tw/dev-member-2022/assets/audio/webaccess_ding.mp3',
                    }),
                },
            },
            eventLabel: '',
        }
    },
    mounted () {
        that = this;
        this.checkLogin();
        this.getEventState();
        AOS.init();
        var rellax = new Rellax('.rellax', {
            speed: 0,
            breakpoints:[768]
        });
    },
    methods: {
        checkLogin() {
            const userMe = 'https://dev-www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    // console.log(response.data);
                    if ( response.data.code === '0001' ) {
                        // window.location.href = 'index.html'
                    } else if ( response.data.code === '0000' ) {
                        if ( window.location.search.indexOf('from=login') && !this.getCookie('member-2022') ) {
                            this.setCookie('member-2022', 'set-cookie-for-member-2022', 90);
                            this.clickSF();
                            dataLayer.push({
                                'event': 'GAEventTrigger',
                                'eventCategory': 'member-2022',
                                'eventAction': 'start',
                                'eventLabel': '',
                            });
                        }
                        this.user = response.data.items[0];
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        clickPlayer(name) {
            const readCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=read';
            const readSuccess = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=read&is_finish=1';
            if ( !this.challenge.read ) {
                axios
                    .get(readCreate)
                    .then((response) => {
                        // console.dir(response);
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            }
            const array = Object.keys(this.webaccess).filter((item) => {
                return item !== name;
            });
            array.forEach(item => {
                this.webaccess[item].player.pause();
            });
            this.webaccess[name].player.playing() ? this.webaccess[name].player.pause() : this.webaccess[name].player.play();
            this.webaccess[name].player.on('end', function() {
                console.log('Finished!');
                if ( !that.challenge.read ) {
                    axios.get(readSuccess)
                        .then((response) => {
                            // console.dir(response);
                            dataLayer.push({
                                'event': 'GAEventTrigger',
                                'eventCategory': 'member-2022',
                                'eventAction': 'finish',
                                'eventLabel': '3D_K',
                            });
                            $('#successModal, .modal-backdrop').fadeIn();
                            $('body').addClass('modal-open');
                            that.challenge.read = true;
                        })
                        .then(() => {
                            that.getEventState('finish');
                        })
                        .catch((error) => {
                            console.dir(error);
                        });
                    setTimeout(() => {
                        $(`.duration`).width(0);
                        clearInterval(update);
                    }, 300);
                }
                return;
            });
            let update = setInterval(() => {
                this.updateWidth(this.webaccess[name].player, name); 
            }, 300);
        },
        updateWidth(player, name) {
            if (player.playing()) {
                let width = (( Number(player.seek().toFixed(1)) / Number(player.duration().toFixed(1)) ) * 100) + '%';
                $(`.${name}_player-duration`).width(width);
                this.webaccess[name].state = true;
            } else {
                if ( this.webaccess[name].state === true ) {
                    this.webaccess[name].state = false;
                }
            }
        },
        getEventState(type) {
            const activityCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/get';
            axios
                .get(activityCreate)
                .then((response) => {
                    // console.log(response);
                    this.eventLabel = '';
                    let arry = response.data.items;
                    if ( arry.length > 0 ) {
                        this.eventLabel += '3D';
                        arry.forEach(element => {
                            switch (element.event_name) {
                                case 'read':
                                    this.eventLabel += '_K';
                                    break;
                                case 'learn':
                                    this.eventLabel += '_L';
                                    break;
                                case 'book':
                                    this.eventLabel += '_B';
                                    break;
                            }
                            if ( element.is_finish === 1 ) {
                                this.challenge[element.event_name] = true;
                            }
                        });
                    }
                })
                .then(() => {
                    if ( type === 'finish' ) {
                        this.clickSF();
                    }
                })
                .catch((error) => {
                    console.dir(error);
                });
        },
        setCookie(name, value, day) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (day*24*60*60*1000));
            document.cookie = name + "=" + escape(value) + ";SameSite=Strict;expires=" + expires.toGMTString()
        },
        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        },
        closeModal() {
            $('.modal, .modal-backdrop').fadeOut();
            $('body').removeClass('modal-open');
        },
        clickSF() {
            setTimeout(function() {
                $("#sendBtn").click();
                console.log('clicked SF2');
            }, 100);
        },
    }
})

app.mount('#app');
