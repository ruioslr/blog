const fs = require('fs');
const path = require('path')

const rootPath = path.resolve(__dirname, '../');
const excludeDir = ['.idea', '.vuepress', 'dist', 'node_modules', '.git']


const getItems = (dir) => {
    const res = [];
    const files = fs.readdirSync(dir).filter(_ => fs.statSync(path.resolve(rootPath, dir) + '/' + _).isFile()).map(_ => _.slice(0, -3))
    const dirs = fs.readdirSync(dir).filter(_ => fs.statSync(path.resolve(rootPath, dir) + '/' + _).isDirectory())
    return files.concat(dirs)
    res.push({
        title: dir,
        collapsable: true,
        children
    })
    dirs.forEach(dir => {
        files.push({
            title: dir,
            collapsable: true,

        })
    })

}
const getSidebar =  () => {
    const res = {};
    const allFiles = fs.readdirSync(rootPath).filter(_ => !excludeDir.includes(_));
    const dirs = allFiles.filter(_ => fs.statSync(rootPath + '/' + _).isDirectory());
    dirs.forEach(dir => {
        res[`/${dir}/`] = {
            title: dir,
            children: getItems(dir)
        };
    })
    return res;
}

const getNav = () => {
    const allFiles = fs.readdirSync(rootPath).filter(_ => !excludeDir.includes(_));
    const dirs = allFiles.filter(_ => fs.statSync(rootPath + '/' + _).isDirectory());
    const res = [];

    dirs.forEach(dir => {
        const firstFileName = fs.readdirSync(rootPath + '/' + dir)[0]
        res.push({text: dir, link: `/${dir}/${firstFileName}`})
    })
    return res;
}
module.exports = {
    getSidebar,
    getNav
}

console.log(getSidebar());