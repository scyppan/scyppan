function randbetween(min, max) { // min and max included 
  var val = Math.floor(Math.random() * (max - min + 1) + min);
  return val;
}

function returninrange(lo, hi, val){
    if(val>hi){return hi;}
  if(val<lo){return lo;}else{
  return val;
  }
}

function downloadtxt(txt,filename){

  var link = window.document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(txt));
  link.setAttribute("download", filename);
  link.click();
}

function castarrayasint(array){
  let result = array.map(function (x) { 
      return parseInt(x, 10); 
    });
    
  return result;
}

function getfreeid(array){

  for (let i=1;i<array.length;i++){
    if(array.includes(i,0)){}else{return i;}
  }
  
  return array.length;
}

function checkiffreeid(id, array){
  return !array.includes(id);
}

async function filereader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const result = await readtxtfile(e.target.result);
        resolve(result);
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(error); // Reject the promise if parsing fails
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(error); // Reject the promise if reading fails
    };

    reader.readAsText(file); // Initiates reading the file's text
  });
}

function readtxtfile(text) {
  return new Promise((resolve, reject) => {
    // Check if the text is provided
    if (!text) {
      reject("No text content provided.");
      return;
    }

    try {
      const result = parsetabdelimitedtext(text);
      resolve(result); // Resolve the promise with the parsed result
    } catch (error) {
      reject("Could not parse the text content.");
    }
  });
}  

function parsetabdelimitedtext(text) {
  const lines = text.split('\n');
  const columnNames = lines[0].split('\t').map(name => name.trim().replace(/^"|"$/g, '')); // Clean column names
  let result = [];

  for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t').map(value => value.trim().replace(/^"|"$/g, '')); // Clean values
      if (values.length === columnNames.length) {
          let obj = {};
          columnNames.forEach((col, index) => {
              obj[col] = values[index];
          });
          obj = tryparseallvals(obj); // Convert all string values to integers where possible
          result.push(obj);
      }
  }

  return result;
}

function tryparseallvals(obj) {
  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          // Attempt to detect date format without conversion
          if (!(/^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value)))) {
              // Only attempt to parse as integer if not a valid date string
              const parsedValue = parseInt(value, 10);
              if (!isNaN(parsedValue)) {
                  obj[key] = parsedValue; // Assign the parsed integer back to the object
              }
              // If parsing fails, the original string remains unchanged
          }
          // If it's a valid date string, it remains unchanged
      }
  }
  return obj; // Return the modified object with dates as strings and numbers parsed where possible
}

async function fetchfile(url, encoding) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response issue');
      }
      const buffer = await response.arrayBuffer(); // Fetch the data as ArrayBuffer
      const decoder = new TextDecoder(encoding); // Assuming the data is UTF-16LE encoded; adjust if necessary
      const text = decoder.decode(buffer);
      return text; // Return the decoded text
  } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      return null; // Return null or appropriate error handling
  }
}

function getdollars(value) {
let num = parseFloat(value);
if (isNaN(num) || !isFinite(num)) {
  // Return the original value if parsing fails or results in an infinite/NaN value
  return value;
} else {
  // Return the formatted string with two decimal places prefixed by a dollar sign
  return `$${num.toFixed(2)}`;
}
}

function calculateage(birthdate, referenceDate) {
// Parse the birthdate and referenceDate from string to Date objects
let birth = new Date(birthdate);
let reference = new Date(referenceDate);

// Calculate the difference in years
let age = reference.getFullYear() - birth.getFullYear();

// Adjust the age if the reference date is before the birth date
if (reference.getMonth() < birth.getMonth() || 
    (reference.getMonth() === birth.getMonth() && reference.getDate() < birth.getDate())) {
    age--;
}

return age;
}

function downloadjson(prj, filename){
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prj));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode); // Firefox requires the element to be in the DOM to initiate download
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function readjson(file) {
  if (file instanceof File) {
      const reader = new FileReader();

      // Promise wrapper to handle asynchronous reading
      return new Promise((resolve, reject) => {
          reader.onload = (event) => {
              try {
                  const obj = JSON.parse(event.target.result); // Parses the file content to JSON
                  resolve(obj);
              } catch (error) {
                  reject('Parsing error: ' + error.message);
              }
          };

          reader.onerror = (event) => {
              reject('File reading error: ' + event.target.error.message);
          };

          reader.readAsText(file); // Reads the file content as text (assumes UTF-8 encoding)
      });
  } else {
      throw new Error('Invalid input type: input must be a File object.');
  }
}

function downloadproject(prj, filenamestem){
  const now = new Date();
  const datetimeString = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  downloadjson(prj, filenamestem +"-" + dateTimeString + "-autosave.json");
}


function getnumdaysinmonth(month, year){
	switch(month){
		case 'Feb': if(checkleapyear(year)){return 29;} return 28;
		case 'Apr': return 30;
		case 'Jun': return 30;
		case 'Sep': return 30;
		case 'Nov': return 30;
		default: return 31;
	}
}
function checkleapyear(year){
	//source: https://scienceworld.wolfram.com/astronomy/LeapYear.html#:~:text=Leap%20years%20were%20therefore%2045,out%20of%20every%20four%20centuries).
	let leapyears = [-45,-42,-39,-36,-33,-30,-27,-24,-21,-18,-15,-12,-9,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,224,228,232,236,240,244,248,252,256,260,264,268,272,276,280,284,288,292,296,300,304,308,312,316,320,324,328,332,336,340,344,348,352,356,360,364,368,372,376,380,384,388,392,396,400,404,408,412,416,420,424,428,432,436,440,444,448,452,456,460,464,468,472,476,480,484,488,492,496,500,504,508,512,516,520,524,528,532,536,540,544,548,552,556,560,564,568,572,576,580,584,588,592,596,600,604,608,612,616,620,624,628,632,636,640,644,648,652,656,660,664,668,672,676,680,684,688,692,696,700,704,708,712,716,720,724,728,732,736,740,744,748,752,756,760,764,768,772,776,780,784,788,792,796,800,804,808,812,816,820,824,828,832,836,840,844,848,852,856,860,864,868,872,876,880,884,888,892,896,900,904,908,912,916,920,924,928,932,936,940,944,948,952,956,960,964,968,972,976,980,984,988,992,996,1000,1004,1008,1012,1016,1020,1024,1028,1032,1036,1040,1044,1048,1052,1056,1060,1064,1068,1072,1076,1080,1084,1088,1092,1096,1100,1104,1108,1112,1116,1120,1124,1128,1132,1136,1140,1144,1148,1152,1156,1160,1164,1168,1172,1176,1180,1184,1188,1192,1196,1200,1204,1208,1212,1216,1220,1224,1228,1232,1236,1240,1244,1248,1252,1256,1260,1264,1268,1272,1276,1280,1284,1288,1292,1296,1300,1304,1308,1312,1316,1320,1324,1328,1332,1336,1340,1344,1348,1352,1356,1360,1364,1368,1372,1376,1380,1384,1388,1392,1396,1400,1404,1408,1412,1416,1420,1424,1428,1432,1436,1440,1444,1448,1452,1456,1460,1464,1468,1472,1476,1480,1484,1488,1492,1496,1500,1504,1508,1512,1516,1520,1524,1528,1532,1536,1540,1544,1548,1552,1556,1560,1564,1568,1572,1576,1580,1584,1588,1592,1596,1600,1604,1608,1612,1616,1620,1624,1628,1632,1636,1640,1644,1648,1652,1656,1660,1664,1668,1672,1676,1680,1684,1688,1692,1696,1704,1708,1712,1716,1720,1724,1728,1732,1736,1740,1744,1748,1752,1756,1760,1764,1768,1772,1776,1780,1784,1788,1792,1796,1804,1808,1812,1816,1820,1824,1828,1832,1836,1840,1844,1848,1852,1856,1860,1864,1868,1872,1876,1880,1884,1888,1892,1896,1904,1908,1912,1916,1920,1924,1928,1932,1936,1940,1944,1948,1952,1956,1960,1964,1968,1972,1976,1980,1984,1988,1992,1996,2000,2004,2008,2012,2016,2020,2024,2028,2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096];
	
	for(let i=0; i<leapyears.length; i++){
		if(year==leapyears[i]){
			return true;
		}
	}
	
	return false;
}

function getMonthNumber(monthStr) {
    // Define a mapping from month abbreviations to numbers
    const monthMap = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
    };

    // Standardize input to ensure the lookup is case-insensitive
    const standardizedMonthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();

    // Retrieve the number from the map
    return monthMap[standardizedMonthStr] || 1; // Return null if not found
}