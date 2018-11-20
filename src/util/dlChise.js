const chiseIdsGitUrl='http://git.chise.org/git/chise/ids.git'

const workPath=path.resolve(__dirname,'../IDS_data/chise-ids-git/')

//https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

//clean folder
deleteFolderRecursive(workPath);
fs.mkdirSync(workPath)

console.log('Chise IDS data downloading...')
require('simple-git')('../IDS_data').clone(chiseIdsGitUrl,'chise-ids-git',(err)=>{
  if(!err){
    console.log('Done!')
  }
  process.exit(1)
});