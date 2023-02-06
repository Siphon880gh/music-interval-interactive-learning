// For VS Editor Outline
delete {
    ".Setup":{
        "Setup data structures":{},
        "Setup event listeners":{}
    },
    "Intervals":{
        "Calculate interval difference":{},
        "Clear all notations":{},
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
                clearAllNotations();
                document.querySelector(".root")?.classList?.remove("root");
                el.classList.add("root")
                break;
            case "get-interval":
                if(!document.querySelector(".root")) {
                    alert("Error - You haven't selected a root key!");
                    return;
                }
                const homeKeyPos = parseInt(document.querySelector(".root").id.replace("pos-", ""));
                const pointKeyPos = parseInt(el.id.replace("pos-", ""));
                const intervalNotation = curryIntervalNotation(homeKeyPos)(pointKeyPos);
                // console.log({pointKeyPos, homeKeyPos})
                // console.log({intervalNotation})

                clearAllNotations();
                el.setAttribute("interval-answer", intervalNotation)
                // document.querySelector("#result-interval").innerHTML = ((inot)=>{
                //     switch (inot) {
                //         case "o"
                //     }
                // })(intervalNotation);

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
        console.log({root,point})
        if(root<point) {
            let aDiff = (point-root)%12;
            if(aDiff===0) {
                return -1; // octave
            }
            return aDiff;
        } else if(root===point) {
            return 0; // unison
        } else {
            // TODO: UI for future feature of going backwards
            //       Is this needed for music composition?
            const reframedPoint = point%12;
            const reframedRoot = root%12;
            const relativeDown = Math.abs(reframedPoint - reframedRoot);
            console.log({relativeDown});

            while(root>point) {
                root-=12;
            }
            let aDiff = (point-root)%12;
            if(aDiff===0) {
                return -1; // octave
            }
            return aDiff;

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

// Clear all notations
function clearAllNotations() {
    const oldIntervalNotation = document.querySelector("[interval-answer]");
    if(oldIntervalNotation) oldIntervalNotation.removeAttribute("interval-answer");
}