import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
let that = null;
let times = 0;
const app = createApp({
    data() {
        return {
            video: '',
            code: '72190',
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
            api: {
                start: 'https://www.cw.com.tw/api/v1.0/activity/create?event_name=book',
                success: 'https://www.cw.com.tw/api/v1.0/activity/create?event_name=book&is_finish=1',
            },
            book: {
                pdf : {
                    jim: {
                        url: 'https://www.cw.com.tw/member/pdf/0199',
                        state: false,
                        finished: false,
                    },
                    facebook: {
                        url: 'https://www.cw.com.tw/member/pdf/0186',
                        state: false,
                        finished: false,
                    },
                },
                video : {
                    sun: {
                        video: 'https://www.youtube.com/embed/qIvWNo45t4I',
                        state: false,
                        finished: false,
                    },
                    biming: {
                        video: 'https://www.youtube.com/embed/4dKh7NvALg4',
                        state: false,
                        finished: false,
                    },
                },
                audio : {
                    tsai: {
                        url: 'https://storage.googleapis.com/www-cw-com-tw/voice/202202/voice-6209d497a3b63.mp3',
                        state: false,
                        finished: false,
                    },
                    clean: {
                        url: 'https://storage.googleapis.com/www-cw-com-tw/voice/202111/voice-619b5a4cc5f11.mp3',
                        state: false,
                        finished: false,
                    },
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
            const userMe = 'https://www.cw.com.tw/api/v1.0/user/me?fields=name,email,uid';
            axios
                .get(userMe)
                .then((response) => {
                    // console.log(response.data);
                    this.eventLabel = '';
                    if ( response.data.code === '0001' ) {
                        window.location.href = 'index.html'
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
        clickPlayer(type, name) {
            // Api: 先參與遊戲 
            if ( !this.challenge.book ) {
                axios
                    .get(this.api.start)
                    .then((response) => {
                        // console.dir(response);
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            }

            if ( type === 'video' ) {
                this.openVideoModal(name);
            } else if ( type === 'pdf' ||  type === 'audio' ) {
                if ( type === 'pdf' ) {
                    window.open(this.book.pdf[name].url);
                } else if (type === 'audio') {
                    window.open(this.book.audio[name].url);
                }
                console.log(this.challenge.book, !this.challenge.book, this.api.success);
                if ( !this.challenge.book ) {
                    axios
                        .get(this.api.success)
                        .then((response) => {
                            console.dir(response);
                            $('#successModal, .modal-backdrop').fadeIn();
                            $('body').addClass('modal-open');
                            this.challenge.book = true;
                        })
                        .then(() => {
                            dataLayer.push({
                                'event': 'GAEventTrigger',
                                'eventCategory': 'member-2022',
                                'eventAction': 'finish',
                                'eventLabel': '3D_B',
                            });
                            this.getEventState('finish');
                        })
                        .catch((error) => {
                            console.dir(error);
                        });
                }
            }
        },
        updateWidth(player, name) {
            if (player.playing()) {
                let width = (( Number(player.seek().toFixed(1)) / Number(player.duration().toFixed(1)) ) * 100) + '%';
                $(`.${name}_player-duration`).width(width);
                this.book.audio[name].state = true;
            } else {
                if ( this.book.audio[name].state === true ) {
                    this.book.audio[name].state = false;
                }
            }
        },
        stopAudio() {
            console.log(that.book);
            const array = Object.keys(that.book.audio).filter((item) => {
                return item !== name;
            });
            array.forEach(item => {
                console.log(that.book.audio[item]);
                that.book.audio[item].player.pause();
            });
        },
        openVideoModal(name) {
            times = 0;
            that.video = '';
            this.video = this.book.video[name].video;
            $('#videoModal, .modal-backdrop').fadeIn();
            $('body').addClass('modal-open');
        },
        openSuccessModal() {
            if ( times === 1 && !that.challenge.book ) {
                axios
                    .get(this.api.success)
                    .then((response) => {
                        // console.dir(response);
                        $('#successModal, .modal-backdrop').fadeIn();
                        $('body').addClass('modal-open');
                        that.challenge.book = true;
                    })
                    .then(() => {
                        // console.log(that.challenge.book);
                        dataLayer.push({
                            'event': 'GAEventTrigger',
                            'eventCategory': 'member-2022',
                            'eventAction': 'finish',
                            'eventLabel': '3D_B',
                        });
                        that.getEventState('finish');
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
            }
        },
        getEventState(type) {
            const activityCreate = 'https://www.cw.com.tw/api/v1.0/activity/get';
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
        closeModal(type) {
            $('.modal, .modal-backdrop').fadeOut();
            $('body').removeClass('modal-open');
            if ( type === 'video' ) {
                times ++;
                this.openSuccessModal();
            }
        },
        clickSF() {
            setTimeout(function() {
                $("#sendBtn").click();
                console.log('clicked SF2');
            }, 100);
        },
    }
})
app.mount('#app')
