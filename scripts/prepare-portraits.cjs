const fs=require('node:fs');
const {spawnSync}=require('node:child_process');
const source='C:/Users/Dell/.codex/generated_images/01a15ea2-0db4-71d1-b7f2-75a04789cff2/exec-578ad1a1-a610-48f3-851e-41bee6e11cb5.png';
function magick(args){const r=spawnSync('magick',args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr);return r.stdout;}
const [width,height]=magick(['identify','-format','%w %h',source]).trim().split(' ').map(Number);
fs.mkdirSync('assets/images/portraits',{recursive:true});
for(let i=0;i<3;i++){
 const left=Math.round(i*width/3),right=Math.round((i+1)*width/3);
 const out='assets/images/portraits/parent-'+i+'.webp';
 magick([source,'-crop',`${right-left-8}x${height-8}+${left+4}+4`,'+repage','-resize','480x480^','-gravity','center','-extent','480x480','-quality','86',out]);
 for(const size of [480,960])magick([out,'-resize',size+'x','-quality','84',out.replace('.webp','-'+size+'.webp')]);
}
console.log('Prepared three fictional parent portraits.');
