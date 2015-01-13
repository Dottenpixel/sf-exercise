if (!Array.prototype.first) 
{ 
   Array.prototype.first = function(predicate) 
   { 
     "use strict";    
     if (this == null) 
       throw new TypeError();       
     if (typeof predicate != "function") 
       throw new TypeError();  
      
     for (var i = 0; i < this.length; i++) { 
       if (predicate(this[i])) { 
         return this[i]; 
       } 
     }       
     return null; 
   } 
}