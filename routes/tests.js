var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let finalResult = {};
  fs.readFile('./utils/data.dat', 'utf8', (err, data) => {
    if (err) {
      res.status(400).send('error reading the file');
      console.error(err);
      return;
    }
    let dataSource = data;
    finalResult = readAndMakeTheNewData(JSON.parse(dataSource))
    res.status(200).send(JSON.stringify(finalResult));
  });
});

// sort array in alpabetical order
function sortByLetters (beforeArr){
  let afterArr = [];
  afterArr = beforeArr.sort(function(a, b){ 
    var nameA = Object.keys(a)[0].toLowerCase(), nameB = Object.keys(b)[0].toLowerCase();
    if (nameA < nameB) //sort string ascending
     return -1;
    if (nameA > nameB)
     return 1;
    return 0; //default return value
   })
  
  // format values of subtotal
  let newArr = [];
  afterArr = afterArr.forEach(element => {
    let newelement = {};
    newelement[Object.keys(element)[0]] = Object.values(element)[0].toFixed(2)
    newArr.push(newelement)
  });
  return newArr;
}


// process of the data source from dat file
function readAndMakeTheNewData(datasource) {
  let totalSum = 0;
  let afterArr = [];
  // loop through org data source and create new array based on sub key
  datasource.forEach(ele => {
    let newKey = Object.keys(ele) + Object.values(ele)[0].nm;
    let newAmount = Object.values(ele)[0].amt;
    let newobj = {};
    if(afterArr.length>0 && afterArr.findIndex(arrele=> Object.keys(arrele)[0] === newKey)!=-1){
      let foundIndex = afterArr.findIndex(arrele=> Object.keys(arrele)[0] === newKey);
      afterArr[foundIndex][newKey] += Number(newAmount);
      totalSum += Number(newAmount);
    }else{
      newobj[newKey] = 0;  
      afterArr.push(newobj)
    }
  });
  // sort array by alpa
  afterArr = sortByLetters(afterArr)
  return {
    "sortedArray": afterArr,
    "Sum": totalSum.toFixed(2)
  };
}

module.exports = router;
