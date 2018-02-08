var EXPAND_CLASS = 'expanded';
var MOBILE_MAX_WIDTH = 767; //px


$(document).ready(function(event) {

    //Co-Browse Setup -----
    addScript('https://video-poc1.maximusbc.ca/assistserver/sdk/web/consumer/assist.js');
    $('.js-cobrowse').on('click', initCobrowse);

    $('#main-content .collapse').on('show.bs.collapse', onExpandSection)

    //Close collapsible sections when clicking outside.
    $('body').on('click', function(){
        $('#main-content .collapse.in').collapse('hide');
    });

    $('#main-content .collapse').on('click', function(e){
        e.stopPropagation();
        //Don't stop event if it's form submission
        if (e.target.type === "submit") return true;
        if (e.target.href) return true;
        return false;
    });

    initTypeahead();
});

function initCobrowse(){
    console.log('initCobrowse called');
    AssistBoot.addAssistBehaviour();
    AssistBoot.startAssistDialog();
}


function addScript(url)  {
    console.log("adding script: ", url);
    var tt = document.createElement('script');
    tt.setAttribute('src', url);
    document.head.appendChild(tt);
}

function scrollTo($el, scrollTime){
    if (!scrollTime) scrollTime = 500;
    setTimeout(function(){
        $('html, body').animate({
            scrollTop: $el.offset().top - 75
        }, scrollTime);
    }, 250)
}

function initTypeahead(){
    $('#inPersonInput').typeahead({
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: false,
        source: [
            {id: "phone", name: "Phone"},
            {id: "text", name: "Text"},
            {id: "email", name: "Email"},
            {id: "live-chat", name: "Live-Chat"},
            {id: "video-chat", name: "Video-Chat"},
            {id: "translation-services", name: "Translation Services"},
       ],
       afterSelect: function(item){
        //    console.log('afterSelect', item, item.id)
           scrollTo($('#'+item.id), 1000)
       }
    })
}

function onExpandSection(){
    //1. Make sure it's full-width (on desktop breakpoints)
    //2. Make sure it starts at the left (matching #main-content)
    var $el = $(this);

    //Close all others
    if ( $('#main-content .collapse.in').length ){
        $('#main-content .collapse').collapse('hide')
    }


    //Full width
    var position =  $('#main-content').position().left - $(this).position().left;
    var position = position + 45; //account for #main-content padding
    var baseWidth = parseInt($('#main-content').css('width'), 10);
    var width = baseWidth - position;
    $(this).css('width', width);

    if ( $(window).width() > MOBILE_MAX_WIDTH ){
        //Start on left:
        var mainOffset = $('#main-content').offset().left
        // let dataParent = $(this).attr('data-parent');
        var parent = $(this).parents('.sbc-section');
        if (parent.length) {
            var parentOffset = $(this).parents('.sbc-section').offset().left
            // var parentOffset = dataParent ? $(dataParent).offset().left  : $(this).parents('.sbc-section').offset().left
            var offset = mainOffset - parentOffset;
            offset += 15; //account for padding
            $(this).css('left', offset);
        }
    }


    //Bad UX? Unsure.
    // scrollTo($el);
}