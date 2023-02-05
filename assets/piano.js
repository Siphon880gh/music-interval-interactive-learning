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
        const clickMode = document.querySelector("#click-mode").querySelector(".active").id;
        switch(clickMode) {
            case "select-root":
                document.querySelector(".root")?.classList?.remove("root");
                el.classList.add("root")
                break;
            case "get-interval":
                break;
            case "highlight-note":
                el.classList.add("highlighted")
                break;
        }
    })
})
document.querySelector("#click-mode").addEventListener("click", event=>{
    if(!event.target.matches(".active")) return;
    const activeChild = event.target;
    const parentNode = activeChild.parentNode;
    const nthChildIndex = Array.prototype.indexOf.call(parentNode.children, activeChild);
    const nextNthChildIndex = (nthChildIndex+1) % 3;
    const nextNthChild = parentNode.children[nextNthChildIndex];

    activeChild.classList.remove("active");
    nextNthChild.classList.add("active");
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

function getIntervalNotation(diff) {
    switch(diff) {
        case -1:
            return "o";
        case 0:
            return "u";
        case 1:
            return "m2";
        case 2:
            return "M2";
        case 3:
            return "m3";
        case 4:
            return "M3";
        case 5:
            return "P4";
        case 6:
            return "D5";
        case 7:
            return "P5";
        case 8:
            return "m6";
        case 9:
            return "M6";
        case 10:
            return "m7";
        case 11:
            return "M7";
        default:
            alert("Error: getIntervalNotation case number out of bound")
    }
}
function curryIntervalNotation(root) {
    return function(point) {
        let diff = getIntervalDifference(root, point);
        return getIntervalNotation(diff)
    }
}