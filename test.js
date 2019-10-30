const path = require("path");
const glob = require("glob");
const appPath = path.join(process.cwd(), "src");
console.log(appPath);
const entry = glob.sync(path.resolve(appPath, "pages/**/index.js"));
const res = {};
entry.forEach(item => {
  const pathObj = path.parse(item);
  const entryName = pathObj.dir.match(/\/\w+$/g)[0].split("/")[1];
  res[entryName] = item;
});
for (let [i] of Object.entries(res)) {
  console.log(i)
}
