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