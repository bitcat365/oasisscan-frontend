var fs = require("fs");
var path = require("path");
var xmlreader = require('xmlreader');
var arguments = process.argv.splice(2);
var zh = require('./locales/zh.json');

/**
 * 将中文的js文件转换为xml文件，然后上传到crowdin进行翻译。生成的中文xml路径为./src/languages/crowdin/zh.xml
 */
function toCrowdin() {
  console.log('reading');
  let zhData = zh;
  let values = [];
  for (let pro in zhData) {
    if (typeof zhData[pro] === 'object') {
      for (let pro2 in zhData[pro]) {
        values.push(`<string name="${pro}.${pro2}">${zhData[pro][pro2].replace(/\n/g, '\\n').replace(/&(?!amp;)/g,'&amp;')}</string>`)
      }
    } else {
      values.push(`<string name="${pro}">${zhData[pro].replace(/\n/g, '\\n').replace(/&(?!amp;)/g,'&amp;')}</string>`)
    }
  }
  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<resources>
    ${values.join('\n    ')}
</resources>
    `;
  fs.writeFile('./locales/crowdin/zh.xml', xmlString, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("xml转换成功，可以上传到crowdin网站进行翻译！路径为：src/languages/crowdin/zh.xml");
  });
}

/**
 * 将crowdin下载好的xml文件转换为js文件，xml文件应该放置到./src/languages/crowdin/en.xml
 */
function fromCrowdin(locale) {
  if (!locale) {
    locale = 'en';
  }
  let exist = fs.existsSync('./locales/crowdin/'+locale+'.xml');
  if (!exist) {
    console.error('找不到en.xml文件，请从crowdin网站下载对应的英文xml文件!');
    return;
  }
  var data = fs.readFileSync('./locales/crowdin/'+locale+'.xml');
  var oldPath = './locales/'+locale+'.json';
  var zhData = {};
  xmlreader.read(data.toString().replace(/<br\s?\/>/ig, '\n'), function (errors, root) {
    let array = root.resources.string.array;
    array.forEach((item, index)=>{
      if (zhData[item.attributes()['name']]) {
        delete zhData[item.attributes()['name']];
      }
      let key = item.attributes()['name'];
      if (key.indexOf('.') > 0) {
        let keys = key.split('.');
        let fk = keys[0]
        let sk = keys[1]
        if (!zhData[fk]) {
          zhData[fk] = {}
        }
        zhData[fk][sk] = (typeof item.text === 'function' ? item.text() : '').replace(/\n/g,'<br/>')
      } else {
        zhData[item.attributes()['name']] = (typeof item.text === 'function' ? item.text() : '').replace(/\n/g,'<br/>');
      }
    });

    fs.writeFile('./locales/'+locale+'.json', JSON.stringify(zhData,null, '\t'), function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("js语言文件写入成功！路径为：src/languages/"+locale+".js");
    })
  });
}

function fromCrowdinZH() {
  let exist = fs.existsSync('./src/languages/crowdin/zh.xml');
  if (!exist) {
    console.error('找不到en.xml文件，请从crowdin网站下载对应的中文xml文件!');
    return;
  }
  var data = fs.readFileSync('./src/languages/crowdin/zh.xml');
  var oldEn = fs.readFileSync('./src/languages/zh.js');
  eval("var zhData = "+ oldEn.toString().replace(/^export default/,''));
  xmlreader.read(data.toString(), function (errors, root) {
    let array = root.resources.string.array;
    let resStr = 'export default {\n';
    let keys = [];
    array.forEach((item, index)=>{
      if (zhData[item.attributes()['name']]) {
        delete zhData[item.attributes()['name']];
      }
      keys.push("  " + item.attributes()['name'] + ": '" + (typeof item.text === 'function' ? item.text() : '') +"'");
    });
    for (let pro in zhData) {
      keys.push("  " + pro + ": '" + zhData[pro]+"'");
    }
    resStr += keys.join(',\n') + '\n}';

    fs.writeFile('./src/languages/zh.js', resStr, function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("英文js语言文件写入成功！路径为：src/languages/zh.js");
    })
  });
}

function diff() {
  var oldZh = fs.readFileSync('./src/languages/zh-old.js');
  var nowZh = fs.readFileSync('./src/languages/zh.js');
  var oldZhData;
  var nowZhData;
  eval("oldZhData = "+ oldZh.toString().replace(/^export default/,''));
  eval("nowZhData = "+ nowZh.toString().replace(/^export default/,''));
  let diff = {};
  for (var pro in nowZhData) {
    if (!oldZhData[pro] || oldZhData[pro] !== nowZhData[pro]) {
      diff[pro] = nowZhData[pro];
    }
  }
  let values = [];
  for (let pro in diff) {
    values.push(`<string name="${pro}">${diff[pro]}</string>`)
  }
  let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<resources>
    ${values.join('\n    ')}
</resources>
    `;
  fs.writeFile('./src/languages/crowdin/changed_zh.xml', xmlString, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("xml转换成功，可以上传到crowdin网站进行翻译！路径为：src/languages/crowdin/zh.xml");
  });
}

/**
 * 查找没有用过的翻译字段
 */
function findUnUsedStrings() {
  console.log('looking start');
  var filePath = './src';
  var zhSource = fs.readFileSync('./src/languages/zh.js');
  var zHData;
  eval("zHData = "+ zhSource.toString().replace(/^export default/,''));
  let keys = Object.keys(zHData);
  let results = {};
  keys.forEach((key)=>{
    results[key] = [];
    recursiveReadFile(filePath, key);
  });
  console.log('looking end');

  for (var pro in results) {
    let item = results[pro];
    if (!item || item.length === 0) {
      console.log(pro);
    }
  }

  function recursiveReadFile(fileName, lookingForString){
    if(!fs.existsSync(fileName)) return;
    if(isFile(fileName)){
      check(fileName, lookingForString);
    }
    if(isDirectory(fileName)){
      var files = fs.readdirSync(fileName);
      files.forEach(function(val,key){
        var temp = path.join(fileName,val);
        if(isDirectory(temp)) recursiveReadFile(temp, lookingForString);
        if (isFile(temp)) check(temp, lookingForString);
      });
    }
  }
  function check(fileName, lookingForString){
    var data = readFile(fileName);
    var exc = new RegExp("'" + lookingForString + "'");
    var exc2 = new RegExp('"' + lookingForString + '"');
    var exc3 = new RegExp('\\b' + lookingForString + '\\b');
    if(exc.test(data) || exc2.test(data) || exc3.test(data)){
      // console.log(fileName);
      if (fileName.indexOf('src/languages') >= 0) {
        return;
      }
      results[lookingForString].push(fileName);
    }

  }
  function isDirectory(fileName){
    if(fs.existsSync(fileName)) return fs.statSync(fileName).isDirectory();
  }
  function isFile(fileName){
    if(fs.existsSync(fileName)) return fs.statSync(fileName).isFile();
  }
  function readFile(fileName){
    if(fs.existsSync(fileName)) return fs.readFileSync(fileName,"utf-8");
  }
}
if (arguments.length > 0 && arguments[0] === 'toCrowdin') {
  toCrowdin()
} else if(arguments.length > 0 && arguments[0] === 'fromCrowdin'){
  fromCrowdin(arguments[1]);
} else if(arguments.length > 0 && arguments[0] === 'fromCrowdinZH'){
  fromCrowdinZH();
} else if(arguments.length > 0 && arguments[0] === 'diff'){
  diff();
} else if (arguments.length > 0 && arguments[0] === 'search') {
  findUnUsedStrings();
}
