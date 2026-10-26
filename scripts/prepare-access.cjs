const fs=require('node:fs');const {spawnSync}=require('node:child_process');
const source='C:/Users/Dell/.codex/generated_images/01a15ea2-0db4-71d1-b7f2-75a04789cff2/exec-3fa5a951-9cba-4fa7-9f76-c488af037911.png';
function magick(args){const r=spawnSync('magick',args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr);return r.stdout;}
const [width,height]=magick(['identify','-format','%w %h',source]).trim().split(' ').map(Number);
fs.mkdirSync('assets/images/access',{recursive:true});
['login','registration'].forEach((name,i)=>{const left=Math.round(i*width/2),right=Math.round((i+1)*width/2);const out='assets/images/access/'+name+'.webp';magick([source,'-crop',`${right-left-8}x${height-8}+${left+4}+4`,'+repage','-quality','87',out]);for(const size of [480,960])magick([out,'-resize',size+'x','-quality','84',out.replace('.webp','-'+size+'.webp')]);});
console.log('Prepared new login and registration photos.');
