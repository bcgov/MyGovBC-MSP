var EXPAND_CLASS = 'expanded';
var MOBILE_MAX_WIDTH = 767; //px
var ASSISTJS_URL = 'https://video-poc1.maximusbc.ca/assistserver/sdk/web/consumer/assist.js';


$(document).ready(function(event) {

    //Remove all Live-Assist sessions. Can't restore sessions, but no bugs from
    //failed restorations.
    clearAllStorageData();

    //Co-Browse Setup -----
    addScript(ASSISTJS_URL)
    .done(initCobrowse)
    .fail(onCobrowseFailToLoad);

    $('#main-content .collapse').on('show.bs.collapse', onExpandSection)

    //Close collapsible sections when clicking outside.
    $('body').on('click', function(){
        //Improvement: Only do for desktop? Check MOBILE_MAX_WIDTH?
        $('#main-content .collapse.in').collapse('hide');
    });

    $('#main-content .collapse').on('click', function(e){
        e.stopPropagation();
        //Don't stop event if it's form submission
        if (e.target.type === "submit") return true;
        if (e.target.href) return true;
        return false;
    });

    //FIXME: use addScript() to load typeahead script, keeps first page load quicker.
    initTypeahead();
});

function initCobrowse(){
    console.log('initCobrowse called');
    AssistBoot.addAssistBehaviour();
    $('.js-cobrowse').on('click', AssistBoot.startAssistDialog);
}

function onCobrowseFailToLoad(){
    console.error("Network error, unable to load assist.js", ASSISTJS_URL);
    $('.js-cobrowse').on('click', function(){
        alert("Network error: Unable to load assist.js from " + ASSISTJS_URL);
    });
}


function addScript(url) {
    return $.ajax({
        url: url,
        dataType: "script",
        timeout: 3 * 1000,
        cache: true,
    })
    // .done(function (script, textStatus) {
    //     console.log("Added script " + url, textStatus);
    // })
    // .fail(function (jqxhr, settings, exception) {
    //     console.error("Unable to load script" + url, "Reason: " + exception);
    // });
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
    var url;
    $('#inPersonInput').typeahead({
        showHintOnFocus: true,
        fitToElement: true,
        autoSelect: false,
        source: [
            {id: "help desk", name: "Help Desk"},
            {id: "help desk number", name: "Help Desk Number"},
            {id: "helpline for childrin", name: "Helpline for Children"},
            {id: "help kit", name: "Help Kit"},
            {id: "msp", name: "MSP"},
            {id: "msp account", name: "MSP Account"},
            {id: "msp premium assistance plan", name: "MSP Premium Assistance Plan"},
            {id: "msp premiums", name: "MSP premiums"},
            {id: "msp payment", name: "MSP payment"},
            {id: "msp forms", name: "MSP forms"},
            {id: "msp coverage", name: "MSP coverage"},
            {id: "msp account login", name: "MSP Account Login"},
            {id: "phone", name: "Phone"},
            {id: "text", name: "Text"},
            {id: "email", name: "Email"},
            {id: "live chat", name: "Live-Chat"},
            {id: "video chat", name: "Video-Chat"},
            {id: "translation services", name: "Translation Services"}
       ],
       afterSelect: function(item){
            url = "https://www2.gov.bc.ca/gov/search?id=2E4C7D6BCAA4470AAAD2DCADF662E6A0&tab=1&q="
            url += item.id
            // console.log("Setting URL", url);
       }
    })

    $('#inPersonSubmit').click(function(e){
        if (url.length){
            window.open(url);
        }
    })
}

function onExpandSection(){
    //1. Make sure it's full-width (for desktop breakpoints)
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

    //Start on left matching #main-content
    if ( $(window).width() > MOBILE_MAX_WIDTH ){
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

}


/**
 * Deletes ALL local storage and returns to a pristie state.
 *
 * This deletes all Live-Assist sessions, meaning they can no longer be
 * restored, but it also likely reduces runtime bugs. Useful for demo, but will
 * likely need a gentler touch for a production solution.
 */
function clearAllStorageData(){
    if (localStorage) {
        localStorage.clear();
    }

    if (sessionStorage) {
        sessionStorage.clear();
    }
}

// function enableCoBrowseUI(){

// }