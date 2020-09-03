const fs = require('fs');
const path = require('path')

const rootPath = path.resolve(__dirname, '../');
const excludeDir = ['.idea', '.vuepress', 'dist', 'node_modules', '.git']


const getItems = (dir) => {
    const res = [];
    const files = fs.readdirSync(dir).filter(_ => fs.statSync(path.resolve(rootPath, dir) + '/' + _).isFile()).map(_ => _.slice(0, -3))
    const dirs = fs.readdirSync(dir).filter(_ => fs.statSync(path.resolve(rootPath, dir) + '/' + _).isDirectory())

    if(dir === 'javascript'){
        console.log('files:', files)
    }

    files.forEach(filename => {
        if(filename.toLowerCase() === 'readme'){
            res.push({
                title: dir,
                path: `/${dir}/`,
            })
            return 
        }
        res.push({
            title: filename,
            path: `/${dir}/${filename}`,
        })
    });

    return res;
}
const getSidebar =  () => {
    const res = [];
    const allFiles = fs.readdirSync(rootPath).filter(_ => !excludeDir.includes(_));
    const dirs = allFiles.filter(_ => fs.statSync(rootPath + '/' + _).isDirectory());
    dirs.forEach(dir => {
        res.push({
            title: dir,
            children: getItems(dir)
        }) ;
    })
    return res;
}

const getNav = () => {
    const allFiles = fs.readdirSync(rootPath).filter(_ => !excludeDir.includes(_));
    const dirs = allFiles.filter(_ => fs.statSync(rootPath + '/' + _).isDirectory());
    const res = [];

    dirs.forEach(dir => {
        let firstFileName = fs.readdirSync(rootPath + '/' + dir)[0];
        // readme 不需要 路径名
        if(firstFileName && firstFileName.toLowerCase() === 'readme.md'){
            firstFileName = ''
        }

        // 这里先将多层的文件夹忽略（文件夹名没有 .md）
        if(!firstFileName.toLowerCase().includes('.md')){
            return;
        }

        res.push({text: dir, link: `/${dir}/${firstFileName}`})
    })
    return res;
}
module.exports = {
    getSidebar,
    getNav
}
