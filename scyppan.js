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

  function readtxtfile(text) {
    return new Promise((resolve, reject) => {
      // Check if the text is provided
      if (!text) {
        reject("No text content provided.");
        return;
      }
  
      try {
        const result = parseTabDelimitedText(text);
        resolve(result); // Resolve the promise with the parsed result
      } catch (error) {
        reject("Could not parse the text content.");
      }
    });
  }  
  
  function parseTabDelimitedText(text) {
    const lines = text.split('\n');
    const columnNames = lines[0].split('\t').map(name => name.trim().replace(/^"|"$/g, ''));
    let result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\t').map(value => value.trim().replace(/^"|"$/g, ''));
        if (values.length === columnNames.length) {
            let obj = {};
            columnNames.forEach((col, index) => {
                obj[col] = values[index];
            });
            result.push(obj);
        }
    }

    return result;
}
  
  function tryparseallvalsasint(obj) {
    // Iterate over each key-value pair in the object
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const parsedValue = parseInt(value, 10);
  
        // Check if the parsedValue is an integer and not NaN
        if (!isNaN(parsedValue)) {
          obj[key] = parsedValue; // Assign the parsed integer back to the object
        }
        // If parsing fails or value is NaN, the original string remains unchanged
      }
    }
  
    return obj; // Return the modified object with values as integers where possible
  }
  
  async function fetchfile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response issue');
        }
        const buffer = await response.arrayBuffer(); // Fetch the data as ArrayBuffer
        const decoder = new TextDecoder('utf-16le'); // Assuming the data is UTF-16LE encoded; adjust if necessary
        const text = decoder.decode(buffer);
        return text; // Return the decoded text
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        return null; // Return null or appropriate error handling
    }
}