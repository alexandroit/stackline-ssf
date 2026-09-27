const {execFileSync}=require('node:child_process');
for(const file of ["ssf.js", "ssf.flow.js"]) execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
