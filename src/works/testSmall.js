let a = [1, 2, 3, 4] 
const idx = a.indexOf(3) 
if (idx > -1) a.splice(idx, 1)

console.log(a)