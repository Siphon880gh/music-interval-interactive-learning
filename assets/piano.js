// For VS Editor Outline
delete {
    ".Setup":{
        "Setup data structures":{},
        "Setup event listeners":{}
    },
    "Intervals":{
        "Calculate interval difference":{},
    },
}

// Setup data structures. Initiate with number of keys
window.keys = new Array(38)

// Setup event listeners
document.querySelectorAll(".position").forEach(el=>{
    el.addEventListener("click", event=>{
        el.classList.add("highlighted")
    })
})

// Calculate interval difference
// Test console.log: 1,2->1
// Test console.log: 2,3->1
// Test console.log: 8,7->1
// Test console.log: 8,8->0
// Test console.log: 1,8->-1
function getIntervalDifference(root, point) {
    const diff = (function(){
        if(root<point) {
            let aDiff = (point-root)%7;
            if(aDiff===0) {
                return -1; // octave
            }
            return aDiff;
        } else if(root===point) {
            return 0; // unison
        } else {
            const reframedPoint = point%7;
            const reframedRoot = root%7;
            return Math.abs(reframedPoint - reframedRoot);
        }

    })();
    return diff;
}

