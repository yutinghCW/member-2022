(function () {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const contentHeight = document.documentElement.scrollHeight;
    const kvWidth = document.getElementById('kv').clientWidth;
    const kvHeight = document.getElementById('kv').clientHeight;
    const kvTop = document.getElementById('kv').getBoundingClientRect().top + (kvHeight / 2);
    const kvLeft = document.getElementById('kv').getBoundingClientRect().left + (kvWidth / 2);
    const kvTriangle = (Math.sqrt((kvTop * kvTop) + (kvLeft * kvLeft)) - Math.sqrt((kvWidth * kvWidth / 4) + (kvHeight * kvHeight / 4)));

    window.addEventListener('scroll', () => {
        let scroll = $(window).scrollTop();
        let magnification = Number((scroll/(contentHeight-height)).toFixed(3));
        // console.log(magnification);
        $('.flip').each(function() {
            if ( $(this).hasClass('flip-north') ) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(-${kvTriangle * magnification * 0.875}px, -${kvTriangle * magnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(-${kvTriangle * magnification * 0.005}px, -${kvTriangle * magnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(-${kvTriangle * magnification}px, 0, 0)`
                    })
                }
            } else if ($(this).hasClass('flip-east')) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(${kvTriangle * 1.75 * magnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(${kvTriangle * 1.75 * magnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(${kvTriangle * 1.75 * magnification * 0.875}px, -${kvTriangle * 1.75 * magnification}px, 0)`
                    })
                }
            } else if ($(this).hasClass('flip-west')) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(-${kvTriangle * 1.75 * magnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(-${kvTriangle * 1.75 * magnification}px, 0, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(-${kvTriangle * 1.75 * magnification * 0.865}px, ${kvTriangle * magnification}px, 0)`
                    })
                }
            } else if ($(this).hasClass('flip-south')) {
                if ( $(this).hasClass('flip-x-1') ) {
                    $(this).css({
                        'transform': `skewY(-30deg) translate3d(${kvTriangle * 1.25 * magnification * 0.875}px, ${kvTriangle * 1.25 * magnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-x-2') ) {
                    $(this).css({
                        'transform': `skew(60deg, -30deg) translate3d(${kvTriangle * 1.25 * magnification * 0.005}px, ${kvTriangle * 1.25 * magnification}px, 0)`
                    })
                } else if ( $(this).hasClass('flip-y-1') ) {
                    $(this).css({
                        'transform': `skewY(30deg) translate3d(${kvTriangle * 1.25 * magnification}px, 0, 0)`
                    })
                }
            }
        });
    });
}());