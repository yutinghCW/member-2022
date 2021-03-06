$(window).scrollTop(0);

(function () {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const contentHeight = document.getElementById('awards').clientHeight + height;
    const kvWidth = document.getElementById('kv').clientWidth;
    const kvHeight = document.getElementById('kv').clientHeight;
    const kvTop = document.getElementById('kv').getBoundingClientRect().top + (kvHeight / 2);
    const kvLeft = document.getElementById('kv').getBoundingClientRect().left + (kvWidth / 2);
    const kvTriangle = Math.sqrt((kvWidth * kvWidth / 4) + (kvHeight * kvHeight / 4));

    let lastScrollTop = 0;

    function flipInt() {
        $('.flip').each(function() {
            if ( $(this).hasClass('flip-x-1') ) {
                $(this).css({
                    'transform': `skewY(-30deg) translate3d(0, 0, 0)`
                })
            } else if ( $(this).hasClass('flip-x-2') ) {
                $(this).css({
                    'transform': `skew(60deg, -30deg) translate3d(0, 0, 0)`
                })
            } else if ( $(this).hasClass('flip-y-1') ) {
                $(this).css({
                    'transform': `skewY(30deg) translate3d(0, 0, 0)`
                })
            }
        });
    };

    $('.flip').each(function() {
        $(this).children('span').hide();
        let unit = Number($(this).attr('data-offset')) / 170;
        let magnification = 1;
        let newMagnification = magnification * unit;
        if ( $(this).hasClass('flip-north') ) {
            if ( $(this).hasClass('flip-x-1') ) {
                $(this).css({
                    'transform': `skewY(-30deg) translate3d(-${kvTriangle * newMagnification * 0.875}px, -${kvTriangle * newMagnification}px, 0)`
                })
            } else if ( $(this).hasClass('flip-x-2') ) {
                $(this).css({
                    'transform': `skew(60deg, -30deg) translate3d(-${kvTriangle * newMagnification * 0.005}px, -${kvTriangle * newMagnification}px, 0)`
                })
            } else if ( $(this).hasClass('flip-y-1') ) {
                $(this).css({
                    'transform': `skewY(30deg) translate3d(-${kvTriangle * newMagnification}px, 0, 0)`
                })
            }
        } else if ($(this).hasClass('flip-east')) {
            if ( $(this).hasClass('flip-x-1') ) {
                $(this).css({
                    'transform': `skewY(-30deg) translate3d(${kvTriangle * newMagnification}px, 0, 0)`
                })
            } else if ( $(this).hasClass('flip-x-2') ) {
                $(this).css({
                    'transform': `skew(60deg, -30deg) translate3d(${kvTriangle * newMagnification}px, 0, 0)`
                })
            } else if ( $(this).hasClass('flip-y-1') ) {
                $(this).css({
                    'transform': `skewY(30deg) translate3d(${kvTriangle * newMagnification * 0.875}px, -${kvTriangle * newMagnification}px, 0)`
                })
            }
        } else if ($(this).hasClass('flip-west')) {
            if ( $(this).hasClass('flip-x-1') ) {
                $(this).css({
                    'transform': `skewY(-30deg) translate3d(-${kvTriangle * newMagnification}px, 0, 0)`
                })
            } else if ( $(this).hasClass('flip-x-2') ) {
                $(this).css({
                    'transform': `skew(60deg, -30deg) translate3d(-${kvTriangle * newMagnification}px, 0, 0)`
                })
            } else if ( $(this).hasClass('flip-y-1') ) {
                $(this).css({
                    'transform': `skewY(30deg) translate3d(-${kvTriangle * newMagnification * 0.865}px, ${kvTriangle * newMagnification}px, 0)`
                })
            }
        } else if ($(this).hasClass('flip-south')) {
            if ( $(this).hasClass('flip-x-1') ) {
                $(this).css({
                    'transform': `skewY(-30deg) translate3d(${kvTriangle * 1.25 * newMagnification * 0.875}px, ${kvTriangle * 1.25 * newMagnification}px, 0)`
                })
            } else if ( $(this).hasClass('flip-x-2') ) {
                $(this).css({
                    'transform': `skew(60deg, -30deg) translate3d(${kvTriangle * 1.25 * newMagnification * 0.005}px, ${kvTriangle * 1.25 * newMagnification}px, 0)`
                })
            } else if ( $(this).hasClass('flip-y-1') ) {
                $(this).css({
                    'transform': `skewY(30deg) translate3d(${kvTriangle * 1.25 * newMagnification}px, 0, 0)`
                })
            }
        }
    });

    setTimeout(() => {
        $('.flip').fadeIn(800);
        $('img#kv').css('opacity', 1);
    }, 500);

    if ( window.location.hash ) {
        let hash = window.location.hash.split('#')[1];
        let hashTop = $(`#${hash}`).offset().top;
        $(window).scrollTop(hashTop - 50);
    }

    if ( !window.location.hash ) {
        setTimeout(() => {
            flipInt();
        }, 1300);
        setTimeout(() => {
            $('body, .flip').addClass('completed');
        }, 3200);
    } else {
        setTimeout(() => {
            $('body, .flip').addClass('completed');
        });
    }
    setTimeout(() => {
        $('header, .flip span, .key-visual-text, .btn-line, .icon-mouse').fadeIn();
    }, 2800);

    window.addEventListener('scroll', () => {
        let scroll = window.pageYOffset || document.documentElement.scrollTop;
        let magnification = Number((scroll/(contentHeight-height)).toFixed(3));
        $('.flip').each(function() {
            // $(this).text($(this).attr('class'));
            if ( scroll > (height / 2) ) {
                $(this).addClass('scroll');
                $('.key-visual-text, .icon-mouse').fadeOut();
            } else {
                $(this).removeClass('scroll');
                $('.key-visual-text, .icon-mouse').fadeIn();
            }
            let unit = Number($(this).attr('data-offset')) / 170;
            let newMagnification = magnification * unit;
            if ( magnification > 1 ) {
                return false;
            }
            if ( $(this).hasClass('flip-north') ) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(-${kvTriangle * newMagnification * 0.875}px, -${kvTriangle * newMagnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(-${kvTriangle * newMagnification * 0.005}px, -${kvTriangle * newMagnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(-${kvTriangle * newMagnification}px, 0, 0)`
                    })
                }
            } else if ($(this).hasClass('flip-east')) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(${kvTriangle * newMagnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(${kvTriangle * newMagnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(${kvTriangle * newMagnification * 0.875}px, -${kvTriangle * newMagnification}px, 0)`
                    })
                }
            } else if ($(this).hasClass('flip-west')) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(-${kvTriangle * newMagnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(-${kvTriangle * newMagnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(-${kvTriangle * newMagnification * 0.865}px, ${kvTriangle * newMagnification}px, 0)`
                    })
                }
            } else if ($(this).hasClass('flip-south')) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(${kvTriangle * 1.25 * newMagnification * 0.875}px, ${kvTriangle * 1.25 * newMagnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(${kvTriangle * 1.25 * newMagnification * 0.005}px, ${kvTriangle * 1.25 * newMagnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(${kvTriangle * 1.25 * newMagnification}px, 0, 0)`
                    })
                }
            }
        });

        lastScrollTop = scroll <= 0 ? 0 : scroll;
    }, false);
}());