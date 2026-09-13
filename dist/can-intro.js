(() => {
 const section=document.getElementById('can-intro'),video=document.getElementById('can-video');
 // Choose once, before requesting media: never download both variants.
 const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 const light=innerWidth<=768||connection?.saveData||/^(slow-2g|2g|3g)$/.test(connection?.effectiveType||'');
 video.src=light?'assets/banner-web-light.mp4':'assets/banner-web-hd.mp4';
 let target=0,queued=false;
 function seek(){queued=false;if(!Number.isFinite(video.duration)||video.seeking)return;if(Math.abs(video.currentTime-target)>1/60)video.currentTime=target}
 function update(){const range=section.offsetHeight-innerHeight;const progress=Math.max(0,Math.min(1,(scrollY-section.offsetTop)/range));target=progress*Math.max(0,(video.duration||0)-1/30);if(!queued){queued=true;requestAnimationFrame(seek)}}
 video.addEventListener('loadedmetadata',update);video.addEventListener('loadeddata',update);video.addEventListener('seeked',seek);
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
})();
