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

  function readtxtfile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; // Fetch the file from the input
    if (!file) {
      console.log("No file selected.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const result = parseTabDelimitedText(text);
      console.log(result); // Here you have your object, parsed as UTF-8
    };
    reader.readAsText(file, 'UTF-8'); // Explicitly specifying UTF-8 encoding
  }
  
  function parseTabDelimitedText(text) {
    const lines = text.split('\n');
    const columnNames = lines[0].split('\t');
    let result = [];
  
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t');
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