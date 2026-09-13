(() => {
 const section=document.getElementById('can-intro'),video=document.getElementById('can-video');
 let target=0,queued=false;
 function seek(){queued=false;if(!Number.isFinite(video.duration)||video.seeking)return;if(Math.abs(video.currentTime-target)>1/60)video.currentTime=target}
 function update(){const range=section.offsetHeight-innerHeight;const progress=Math.max(0,Math.min(1,(scrollY-section.offsetTop)/range));target=progress*Math.max(0,(video.duration||0)-1/30);if(!queued){queued=true;requestAnimationFrame(seek)}}
 video.addEventListener('loadedmetadata',update);video.addEventListener('loadeddata',update);video.addEventListener('seeked',seek);
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
})();
