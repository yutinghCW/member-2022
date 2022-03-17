(function () {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const contentHeight = document.documentElement.scrollHeight;
    const kvWidth = document.getElementById('kv').clientWidth;
    const kvHeight = document.getElementById('kv').clientHeight;
    const kvTop = document.getElementById('kv').getBoundingClientRect().top + (kvHeight / 2);
    const kvLeft = document.getElementById('kv').getBoundingClientRect().left + (kvWidth / 2);
    const kvTriangle = Math.sqrt((kvWidth * kvWidth / 4) + (kvHeight * kvHeight / 4));

    console.log(Math.sqrt((kvTop * kvTop) + (kvLeft * kvLeft)));
    console.log(Math.sqrt((kvWidth * kvWidth / 4) + (kvHeight * kvHeight / 4)));

    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scroll = $(window).scrollTop();
        let magnification = Number((scroll/(contentHeight-height)).toFixed(3));
        // console.log(magnification);
        $('.flip').each(function() {
            // $(this).text($(this).attr('class'));
            if ( scroll > (height / 3 * 2) ) {
                $(this).addClass('scroll');
                $('a.logo, .key-visual-text').fadeOut();
            } else {
                $(this).removeClass('scroll');
                $('a.logo, .key-visual-text').fadeIn();
            }
            let unit = Number($(this).attr('data-offset')) / 170;
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
    });
    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > (height / 3 * 2) ){
           // downscroll code
            $('nav').fadeOut();
        } else {
           // upscroll code
           $('nav').fadeIn();
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
     }, false);     
}());