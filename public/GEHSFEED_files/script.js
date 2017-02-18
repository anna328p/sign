var rp={};rp.settings={debug:true,animationSpeed:1000,shouldAutoNextSlide:true,timeToNextSlide:6*1000,cookieDays:300,goodExtensions:['.jpg','.jpeg','.gif','.bmp','.png'],nsfw:true};rp.session={activeIndex:-1,isAnimating:false,nextSlideTimeoutId:null,after:"",foundOneImage:false,loadingNextImages:false};rp.photos=[];rp.cache={};$(function(){pictureSliderId="#pictureSlider";$("#subredditUrl").text("Loading Reddit Slideshow");$("#navboxTitle").text("Loading Reddit Slideshow");var fadeoutWhenIdle=true;var setupFadeoutOnIdle=function(){$('.fadeOnIdle').fadeTo('fast',0);var navboxVisible=false;var fadeoutTimer=null;var fadeoutFunction=function(){navboxVisible=false;if(fadeoutWhenIdle){$('.fadeOnIdle').fadeTo('slow',0);}};$("body").mousemove(function(){if(navboxVisible){clearTimeout(fadeoutTimer);fadeoutTimer=setTimeout(fadeoutFunction,2000);return;}navboxVisible=true;$('.fadeOnIdle').fadeTo('fast',1);fadeoutTimer=setTimeout(fadeoutFunction,2000);});};var getNextSlideIndex=function(currentIndex){if(!rp.settings.nsfw){for(var i=currentIndex+1;i<rp.photos.length;i++){if(!rp.photos[i].over18){return i;}}}if(isLastImage(getNextSlideIndex)&&!rp.session.loadingNextImages){return 0;}return currentIndex+1;}
function nextSlide(){var next=getNextSlideIndex(rp.session.activeIndex);startAnimation(next);}function prevSlide(){if(!rp.settings.nsfw){for(var i=rp.session.activeIndex-1;i>0;i--){if(!rp.photos[i].over18){return startAnimation(i);}}}startAnimation(rp.session.activeIndex-1);}var autoNextSlide=function(){if(rp.settings.shouldAutoNextSlide){nextSlide();}};function open_in_background(selector){var link=$(selector)[0];if(navigator.userAgent.match(/msie/i)||navigator.userAgent.match(/trident/i)||navigator.userAgent.match(/firefox/i)){window.open(link.href,'_blank');}else{var mev=document.createEvent("MouseEvents");mev.initMouseEvent("click",true,true,window,0,0,0,0,0,true,false,false,true,0,null);link.dispatchEvent(mev);}}$(pictureSliderId).touchwipe({wipeLeft:nextSlide,wipeRight:prevSlide,wipeUp:nextSlide,wipeDown:prevSlide,min_move_x:20,min_move_y:20,preventDefaultEvents:false});var OPENSTATE_ATTR="data-openstate";$('.collapser').click(function(){var state=$(this).attr(OPENSTATE_ATTR);if(state=="open"){$(this).text("+");var arrowLeftPoint=$(this).position().left;$(this).parent().animate({left:"-"+arrowLeftPoint+"px"});$(this).attr(OPENSTATE_ATTR,"closed");}else{$(this).text("-");$(this).parent().animate({left:"0px"});$(this).attr(OPENSTATE_ATTR,"open");}});var preLoadImages=function(){var args_len=arguments.length;for(var i=args_len;i--;){var cacheImage=document.createElement('img');cacheImage.src=arguments[i];}};var cookieNames={nsfwCookie:"nsfwCookie",shouldAutoNextSlideCookie:"shouldAutoNextSlideCookie",timeToNextSlideCookie:"timeToNextSlideCookie"};var setCookie=function(c_name,value){Cookies.set(c_name,value,{expires:rp.settings.cookieDays});};var getCookie=function(c_name){return Cookies.get(c_name);};var resetNextSlideTimer=function(){clearTimeout(rp.session.nextSlideTimeoutId);rp.session.nextSlideTimeoutId=setTimeout(autoNextSlide,rp.settings.timeToNextSlide);};var updateAutoNext=function(){rp.settings.shouldAutoNextSlide=$("#autoNextSlide").is(':checked');setCookie(cookieNames.shouldAutoNextSlideCookie,rp.settings.shouldAutoNextSlide);resetNextSlideTimer();};var toggleFullScreen=function(){var elem=document.getElementById('page');if(document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement){if(document.exitFullscreen){document.exitFullscreen();}else if(document.msExitFullscreen){document.msExitFullscreen();}else if(document.mozCancelFullScreen){document.mozCancelFullScreen();}else if(document.webkitExitFullscreen){document.webkitExitFullscreen();}}else{if(elem.requestFullscreen){elem.requestFullscreen();}else if(elem.msRequestFullscreen){elem.msRequestFullscreen();}else if(elem.mozRequestFullScreen){elem.mozRequestFullScreen();}else if(elem.webkitRequestFullscreen){elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);}}};var updateNsfw=function(){rp.settings.nsfw=$("#nsfw").is(':checked');setCookie(cookieNames.nsfwCookie,rp.settings.nsfw);};var initState=function(){var nsfwByCookie=getCookie(cookieNames.nsfwCookie);if(nsfwByCookie===undefined){rp.settings.nsfw=true;}else{rp.settings.nsfw=(nsfwByCookie==="true");$("#nsfw").prop("checked",rp.settings.nsfw);}$('#nsfw').change(updateNsfw);var autoByCookie=getCookie(cookieNames.shouldAutoNextSlideCookie);if(autoByCookie===undefined){updateAutoNext();}else{rp.settings.shouldAutoNextSlide=(autoByCookie==="true");$("#autoNextSlide").prop("checked",rp.settings.shouldAutoNextSlide);}$('#autoNextSlide').change(updateAutoNext);var updateTimeToNextSlide=function(){var val=$('#timeToNextSlide').val();rp.settings.timeToNextSlide=parseFloat(val)*1000;setCookie(cookieNames.timeToNextSlideCookie,val);};var timeByCookie=getCookie(cookieNames.timeToNextSlideCookie);if(timeByCookie===undefined){updateTimeToNextSlide();}else{rp.settings.timeToNextSlide=parseFloat(timeByCookie)*1000;$('#timeToNextSlide').val(timeByCookie);}$('#fullScreenButton').click(toggleFullScreen);$('#timeToNextSlide').keyup(updateTimeToNextSlide);$('#prevButton').click(prevSlide);$('#nextButton').click(nextSlide);};var addNumberButton=function(numberButton){var navboxUls=$(".navbox ul");var thisNavboxUl=navboxUls[navboxUls.length-1];var newListItem=$("<li />").appendTo(thisNavboxUl);numberButton.appendTo(newListItem);navboxUls.append(document.createTextNode(' '));};var imageTypes={image:'image',gfycat:'gfycat',gifv:'gifv'}
var addImageSlide=function(pic){pic.type=imageTypes.image;var http_prefix='http://';var https_prefix='https://';if(pic.url.indexOf('gfycat.com')>=0){pic.type=imageTypes.gfycat;pic.url=pic.url.replace(http_prefix,https_prefix);}else if(pic.url.search(/^http.*imgur.*gifv?$/)>-1){pic.type=imageTypes.gifv;pic.url=pic.url.replace(http_prefix,https_prefix);}else if(isImageExtension(pic.url)){}else{var betterUrl=tryConvertUrl(pic.url);if(betterUrl!==''){pic.url=betterUrl;}else{if(rp.settings.debug){log('cannot display url as image: '+pic.url);}return;}}rp.session.foundOneImage=true;rp.photos.push(pic);var i=rp.photos.length-1;var numberButton=$("<a />").html(i+1).data("index",i).attr("title",rp.photos[i].title).attr("id","numberButton"+(i+1));if(pic.over18){numberButton.addClass("over18");}numberButton.click(function(){showImage($(this));});numberButton.addClass("numberButton");addNumberButton(numberButton);};var arrow={left:37,up:38,right:39,down:40};var ONE_KEY=49;var NINE_KEY=57;var SPACE=32;var PAGEUP=33;var PAGEDOWN=34;var ENTER=13;var A_KEY=65;var C_KEY=67;var F_KEY=70;var I_KEY=73;var R_KEY=82;var T_KEY=84;$(document).keyup(function(e){if(e.ctrlKey){return;}var code=(e.keyCode?e.keyCode:e.which);switch(code){case C_KEY:$('#controlsDiv .collapser').click();break;case T_KEY:$('#titleDiv .collapser').click();break;case A_KEY:$("#autoNextSlide").prop("checked",!$("#autoNextSlide").is(':checked'));updateAutoNext();break;case I_KEY:open_in_background("#navboxLink");break;case R_KEY:open_in_background("#navboxCommentsLink");break;case F_KEY:toggleFullScreen();break;case PAGEUP:case arrow.left:case arrow.up:return prevSlide();case PAGEDOWN:case arrow.right:case arrow.down:case SPACE:return nextSlide();}});var showImage=function(docElem){var imageIndex=docElem.data("index");startAnimation(imageIndex);};var isLastImage=function(imageIndex){if(rp.settings.nsfw){if(imageIndex==rp.photos.length-1){return true;}else{return false;}}else{for(var i=imageIndex+1;i<rp.photos.length;i++){if(!rp.photos[i].over18){return false;}}return true;}};var preloadNextImage=function(imageIndex){var next=getNextSlideIndex(imageIndex);rp.cache={};if(next<rp.photos.length)rp.cache[next]=createDiv(next);};var startAnimation=function(imageIndex){resetNextSlideTimer();if(rp.session.activeIndex==imageIndex||imageIndex>rp.photos.length-1||imageIndex<0||rp.session.isAnimating||rp.photos.length==0){return;}rp.session.isAnimating=true;animateNavigationBox(imageIndex);slideBackgroundPhoto(imageIndex);preloadNextImage(imageIndex);rp.session.activeIndex=imageIndex;if(isLastImage(rp.session.activeIndex)&&rp.subredditUrl.indexOf('/imgur')!=0){getRedditImages();}};var toggleNumberButton=function(imageIndex,turnOn){var numberButton=$('#numberButton'+(imageIndex+1));if(turnOn){numberButton.addClass('active');}else{numberButton.removeClass('active');}};var animateNavigationBox=function(imageIndex){var photo=rp.photos[imageIndex];var subreddit='/r/'+photo.subreddit;$('#navboxTitle').html(photo.title);$('#navboxSubreddit').attr('href',rp.redditBaseUrl+subreddit).html(subreddit);$('#navboxLink').attr('href',photo.url).attr('title',photo.title);$('#navboxCommentsLink').attr('href',photo.commentsLink).attr('title',"Comments on reddit");toggleNumberButton(rp.session.activeIndex,false);toggleNumberButton(imageIndex,true);};var playButton=$('<img id="playButton" src="/images/play.svg" />');playButton.click(function(){$('video')[0].play();playButton.hide();});$(pictureSliderId).append(playButton);playButton.hide();var startPlayingVideo=function(vid_jq){if(rp.settings.shouldAutoNextSlide){clearTimeout(rp.session.nextSlideTimeoutId);vid_jq.removeAttr('loop');}var onEndFunc=function(e){if(rp.settings.shouldAutoNextSlide)nextSlide();};vid_jq.one('ended',onEndFunc);var playPromise=vid_jq[0].play();if(playPromise&&playPromise.catch){playPromise.catch(function(e){if(e.name==="NotAllowedError"){playButton.show();}else{}console.log(e);});}}
var slideBackgroundPhoto=function(imageIndex){var divNode;if(rp.cache[imageIndex]===undefined){divNode=createDiv(imageIndex);}else{divNode=rp.cache[imageIndex];}divNode.prependTo(pictureSliderId);$(pictureSliderId+" div").fadeIn(rp.settings.animationSpeed);var oldDiv=$(pictureSliderId+" div:not(:first)");oldDiv.fadeOut(rp.settings.animationSpeed,function(){oldDiv.remove();rp.session.isAnimating=false;var maybeVid=$('video');if(maybeVid.length>0){startPlayingVideo(maybeVid);}});}
var createDiv=function(imageIndex){var photo=rp.photos[imageIndex];var divNode=$("<div />");if(photo.type===imageTypes.image){preLoadImages(photo.url);var cssMap=Object();cssMap['display']="none";cssMap['background-image']="url("+photo.url+")";cssMap['background-repeat']="no-repeat";cssMap['background-size']="contain";cssMap['background-position']="center";divNode.css(cssMap).addClass("clouds");}else if(photo.type===imageTypes.gfycat||photo.type===imageTypes.gifv){embedit.embed(photo.url,function(elem){divNode.append(elem);elem.width('100%').height('100%');elem[0].pause();});}else{toastr.error('Unhandled image type, please alert ubershmekel on <a href="https://github.com/ubershmekel/redditp/issues">github</a>');}return divNode;};var verifyNsfwMakesSense=function(){var nsfwImages=0;for(var i=0;i<rp.photos.length;i++){if(rp.photos[i].over18){nsfwImages+=1;}}if(0.8<nsfwImages*1.0/rp.photos.length){rp.settings.nsfw=true;$("#nsfw").prop("checked",nsfw);}};var tryConvertUrl=function(url){if(url.indexOf('imgur.com')>0||url.indexOf('/gallery/')>0){if(url.indexOf('gifv')>=0){if(url.indexOf('i.')===0){url=url.replace('imgur.com','i.imgur.com');}return url.replace('.gifv','.gif');}if(url.indexOf('/a/')>0||url.indexOf('/gallery/')>0){return'';}return url.replace(/r\/[^ \/]+\/(\w+)/,'$1')+'.jpg';}return'';};var isImageExtension=function(url){var dotLocation=url.lastIndexOf('.');if(dotLocation<0){log("skipped no dot: "+url);return false;}var extension=url.substring(dotLocation);if(rp.settings.goodExtensions.indexOf(extension)>=0){return true;}else{return false;}};var decodeUrl=function(url){return decodeURIComponent(url.replace(/\+/g," "));};rp.getRestOfUrl=function(){var regexS="(/(?:(?:r/)|(?:imgur/a/)|(?:u(?:ser)?/)|(?:domain/)|(?:search))[^&#?]*)[?]?(.*)";var regex=new RegExp(regexS);var results=regex.exec(window.location.href);if(results===null){return["",""];}else{return[results[1],decodeUrl(results[2])];}};var failCleanup=function(){if(rp.photos.length>0){return;}$('#navboxTitle').text('');$('#recommend').css({'display':'block'});};var getRedditImages=function(){rp.session.loadingNextImages=true;var jsonUrl=rp.redditBaseUrl+rp.subredditUrl+".json?jsonp=?"+rp.session.after+"&"+getVars;var failedAjax=function(data){toastr.error("Failed ajax, maybe a bad url? Sorry about that :(");failCleanup();};var handleData=function(data){rp.session.after="&after="+data.data.after;if(data.data.children.length===0){toastr.error("No data from this url :(");return;}$.each(data.data.children,function(i,item){addImageSlide({url:item.data.url,title:item.data.title,over18:item.data.over_18,subreddit:item.data.subreddit,commentsLink:rp.redditBaseUrl+item.data.permalink});});verifyNsfwMakesSense();if(!rp.session.foundOneImage){toastr.error("Sorry, no displayable images found in that url :(");}if(rp.session.activeIndex==-1){startAnimation(0);}if(data.data.after==null){log("No more pages to load from this subreddit, reloading the start");var numberButton=$("<span />").addClass("numberButton").text("-");addNumberButton(numberButton);}rp.session.loadingNextImages=false;};if(rp.settings.debug)log('Ajax requesting: '+jsonUrl);$.ajax({url:jsonUrl,dataType:'jsonp',success:handleData,error:failedAjax,404:failedAjax,timeout:5000});};var getImgurAlbum=function(url){var albumID=url.match(/.*\/(.+?$)/)[1];var jsonUrl='https://api.imgur.com/3/album/'+albumID;var failedAjax=function(data){toastr.error("Failed ajax, maybe a bad url? Sorry about that :(");failCleanup();};var handleData=function(data){if(data.data.images.length===0){toastr.error("No data from this url :(");return;}$.each(data.data.images,function(i,item){addImageSlide({url:item.link,title:item.title,over18:item.nsfw,commentsLink:""});});verifyNsfwMakesSense();if(!rp.session.foundOneImage){log(jsonUrl);toastr.error("Sorry, no displayable images found in that url :(");}if(rp.session.activeIndex==-1){startAnimation(0);}rp.session.loadingNextImages=false;};$.ajax({url:jsonUrl,dataType:'json',success:handleData,error:failedAjax,404:failedAjax,timeout:5000,beforeSend:function(xhr){xhr.setRequestHeader('Authorization','Client-ID '+'f2edd1ef8e66eaf');}});};var setupUrls=function(){rp.urlData=rp.getRestOfUrl();rp.subredditUrl=rp.urlData[0];getVars=rp.urlData[1];if(getVars.length>0){getVarsQuestionMark="?"+getVars;}else{getVarsQuestionMark="";}rp.subredditUrl=rp.subredditUrl.replace(/.compact/,"");rp.subredditUrl=rp.subredditUrl.replace(/\/{2,}/,"/");var subredditName;if(rp.subredditUrl===""){rp.subredditUrl="/";subredditName="reddit.com"+getVarsQuestionMark;}else{subredditName=rp.subredditUrl+getVarsQuestionMark;}var visitSubredditUrl=rp.redditBaseUrl+rp.subredditUrl+getVarsQuestionMark;var displayedSubredditName=subredditName;var capsize=19;if(displayedSubredditName.length>capsize){displayedSubredditName=displayedSubredditName.substr(0,capsize)+"&hellip;";}$('#subredditUrl').html("<a href='"+visitSubredditUrl+"'>"+displayedSubredditName+"</a>");document.title="redditP - "+subredditName;};rp.redditBaseUrl="http://www.reddit.com";if(location.protocol==='https:'){rp.redditBaseUrl="https://www.reddit.com";}var getVars;initState();setupUrls();rp.session.foundOneImage=false;if(rp.subredditUrl.indexOf('/imgur')==0)getImgurAlbum(rp.subredditUrl);else
getRedditImages();});