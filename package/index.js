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

  module.export = randbetween, returninrange, downloadtxt;