const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {createRequire}=require('node:module');
const temporary=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'stackline-package-'));
try {
  fs.writeFileSync(path.join(temporary,'package.json'),JSON.stringify({private:true}));
  const packed=execFileSync('npm',['pack','--ignore-scripts','--silent','--pack-destination',temporary],{encoding:'utf8'}).trim();
  assert.equal(path.basename(packed),packed);
  execFileSync('npm',['install','--ignore-scripts','--no-fund','--no-audit','--package-lock=false',path.join(temporary,packed)],{cwd:temporary,stdio:'pipe'});
  const consumer=createRequire(path.join(temporary,'package.json'));
  const metadata=require('../package.json');
  const library=consumer(metadata.name);
  assert.deepEqual(consumer(metadata.name+'/package.json').dependencies,{});
  assert.equal(library.format('yyyy.mm.dd.',45779),'2025.05.02.');assert.equal(library.format('# ?/?',1.5),'1 1/2');
  console.log(metadata.name+' packed consumer: PASS');
} finally { fs.rmSync(temporary,{recursive:true,force:true}); }
