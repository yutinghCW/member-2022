import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
let that = null;
let times = 0;
const app = createApp({
    data() {
        return {
            video: '',
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
                        state: false,
                        finished: false,
                        player: new Howl({
                            src: 'https://storage.googleapis.com/www-cw-com-tw/voice/202202/voice-6209d497a3b63.mp3',
                        }),
                    },
                    clean: {
                        state: false,
                        finished: false,
                        player: new Howl({
                            src: 'https://storage.googleapis.com/www-cw-com-tw/voice/202111/voice-619b5a4cc5f11.mp3',
                        }),
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
                    console.log(response.data);
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
            const bookCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=book';
            const bookSuccess = 'https://dev-www.cw.com.tw/api/v1.0/activity/create?event_name=book&is_finish=1';
            axios
                .get(bookCreate)
                .then((response) => {
                    console.dir(response);
                })
                .catch((error) => {
                    console.dir(error);
                });

            if ( type === 'audio' ) {
                this.stopAudio();
                this.book.audio[name].player.playing() ? this.book.audio[name].player.pause() : this.book.audio[name].player.play();
                this.book.audio[name].player.on('end', function() {
                    console.log('Finished!');
                    axios
                        .get(bookSuccess)
                        .then((response) => {
                            console.dir(response);
                            if ( !that.challenge.book ) {
                                new bootstrap.Modal(document.getElementById('successModal')).show();
                                dataLayer.push({
                                    'event': 'GAEventTrigger',
                                    'eventCategory': 'member-2022',
                                    'eventAction': 'finish',
                                    'eventLabel': '3D_B',
                                });
                            }
                            that.challenge.book = true;
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
                    return;
                });
                let update = setInterval(() => {
                    this.updateWidth(this.book.audio[name].player, name); 
                }, 300);    
            } else if ( type === 'video' ) {
                this.stopAudio();
                this.video = this.book.video[name].video;
                new bootstrap.Modal(document.getElementById('videoModal')).show();
                $('#videoModal').on('shown.bs.modal', function () {
                    times = 0;
                });
                $('#videoModal').on('hidden.bs.modal', function () {
                    times ++;
                    that.video = '';
                    if ( times === 1 ) {
                        axios
                            .get(bookSuccess)
                            .then((response) => {
                                console.dir(response);
                                if ( !that.challenge.book ) {
                                    new bootstrap.Modal(document.getElementById('successModal')).show();
                                    dataLayer.push({
                                        'event': 'GAEventTrigger',
                                        'eventCategory': 'member-2022',
                                        'eventAction': 'finish',
                                        'eventLabel': '3D_B',
                                    });
                                }
                                that.challenge.book = true;
                            })
                            .then(() => {
                                that.getEventState('finish');
                            })
                            .catch((error) => {
                                console.dir(error);
                            });
                    }
                });
            } else if ( type === 'pdf' ) {
                window.open(this.book.pdf[name].url);
                if ( !that.challenge.book ) {
                    new bootstrap.Modal(document.getElementById('successModal')).show();
                }
                axios
                    .get(bookSuccess)
                    .then((response) => {
                        console.dir(response);
                        if ( !that.challenge.book ) {
                            new bootstrap.Modal(document.getElementById('successModal')).show();
                            dataLayer.push({
                                'event': 'GAEventTrigger',
                                'eventCategory': 'member-2022',
                                'eventAction': 'finish',
                                'eventLabel': '3D_B',
                            });
                        }
                        that.challenge.book = true;
                    })
                    .then(() => {
                        that.getEventState('finish');
                    })
                    .catch((error) => {
                        console.dir(error);
                    });
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
            const array = Object.keys(this.book.audio).filter((item) => {
                return item !== name;
            });
            array.forEach(item => {
                this.book.audio[item].player.pause();
            });
        },
        getEventState(type) {
            const activityCreate = 'https://dev-www.cw.com.tw/api/v1.0/activity/get';
            axios
                .get(activityCreate)
                .then((response) => {
                    console.log(response);
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
        clickSF() {
            $("#sendBtn").click();
            console.log('clicked SF');
        },
    }
})
app.mount('#app')
