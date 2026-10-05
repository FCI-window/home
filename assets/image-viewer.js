(() => {
const images=[...document.querySelectorAll('img.zoomable,img.story-image,img.story-art,img.question-illustration,img.screen-shot,img.future-cards,img.future-phone,img.message-card')];
if(!images.length)return;
const dialog=document.createElement('dialog');dialog.className='fci-image-viewer';
const english=document.documentElement.lang==='en';
dialog.setAttribute('aria-label',english?'Enlarged image':'Image viewer');
dialog.innerHTML='<button class="viewer-close" aria-label="Close">×</button><button class="viewer-prev" aria-label="Previous image">‹</button><img alt=""><button class="viewer-next" aria-label="Next image">›</button>';
document.body.append(dialog);
const picture=dialog.querySelector('img');let gallery=[],index=0,returnFocus=null;
function render(){const source=gallery[index];picture.src=source.currentSrc||source.src;picture.alt=source.alt;dialog.querySelector('.viewer-prev').hidden=gallery.length<2;dialog.querySelector('.viewer-next').hidden=gallery.length<2}
function move(delta){index=(index+delta+gallery.length)%gallery.length;render()}
images.forEach(image=>{image.style.cursor='zoom-in';image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label',(image.alt||'Image')+' — zoom');const open=()=>{returnFocus=image;const chapter=image.closest('details');gallery=chapter?images.filter(item=>chapter.contains(item)):[image];index=gallery.indexOf(image);render();dialog.showModal()};image.addEventListener('click',open);image.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}})});
dialog.querySelector('.viewer-close').onclick=()=>dialog.close();dialog.querySelector('.viewer-prev').onclick=()=>move(-1);dialog.querySelector('.viewer-next').onclick=()=>move(1);
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')move(-1);if(event.key==='ArrowRight')move(1)});let touchStartX=0;picture.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0].clientX},{passive:true});picture.addEventListener('touchend',event=>{const distance=event.changedTouches[0].clientX-touchStartX;if(Math.abs(distance)>45)move(distance>0?-1:1)},{passive:true});dialog.addEventListener('close',()=>{picture.src='';returnFocus?.focus()});
})();