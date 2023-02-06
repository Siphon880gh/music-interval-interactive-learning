// For VS Editor Outline
delete {
    ".Setup":{
        "Setup data structures":{},
        "Setup event listeners":{},
        "Setup modifier keys":{}
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
                    // alert("Error - You haven't selected a root key!");
                    // return;
                    el.classList.add("root")
                    return;

                }
                const homeKeyPos = parseInt(document.querySelector(".root").id.replace("pos-", ""));
                const pointKeyPos = parseInt(el.id.replace("pos-", ""));
                const intervalNotation = curryIntervalNotation(homeKeyPos)(pointKeyPos);
                // console.log({pointKeyPos, homeKeyPos})
                // console.log({intervalNotation})

                clearAllNotations();
                el.setAttribute("interval-answer", intervalNotation)
                document.querySelector("#result-interval").innerHTML = ((intnt)=>{
                    switch (intnt) {
                        case "o":
                            return "Octave (o)"
                        case "u":
                            return "Unison (u)"
                        case "m2":
                            return "Minor 2nd (m2)"
                        case "M2":
                            return "Major 2nd (M2)"
                        case "m3":
                            return "Minor 3rd (m3)"
                        case "M3":
                            return "Major 3rd (M3)"
                        case "P4":
                            return "Perfect 4th (P4)"
                        case "D5":
                            return "Diminished 5th / Augmented 4th (D5/A4)"
                        case "P5":
                            return "Perfect 5th (P5)"
                        case "m6":
                            return "Minor 6th (m6)"
                        case "M6":
                            return "Majror 6th (M6)"
                        case "m7":
                            return "Minor 7th (m7)"
                        case "M7":
                            return "Major 7th (M7)"
                        default:
                            return "Error: Interval not found";
                    }
                })(intervalNotation);

                break;
            case "highlight-note":
                el.classList.add("highlighted")
                break;
        }
    })
})

/**
 * 
 * function getNextSibling
 * 
 * Receives an element, then gets the next sibling element. Direct ancestor must be the parent of all the siblings. 
 * Option to cycle to the first element if iterated out of N where N is the total number of siblings including the current node.
 * Returns -1 if you are not cycling and iterated out of N.
 * Returns x+1 if have next sibling, or returns 0 if cycled back.
 * 
 * 
 * @param {*} activeChild   Current node to find the next sibling element
 * @param {*} rotates       default true. Rotates back when iterated out of N+1, where N is the total number of siblings and the current node.
 * 
 * @returns                 The same element, a sibling steps away, or -1 if out of bound and rotate is false
 */
function getNextSibling(steps, activeChild, rotates=true) {
    if(steps===0) 
        return activeChild;
    const parentNode = activeChild.parentNode;
    const nthChildIndex = Array.prototype.indexOf.call(parentNode.children, activeChild);
    const nextNthChildIndex = (function() {
        if(rotates)
            return (nthChildIndex+steps) % parentNode.children.length;
        else {
            if(nthChildIndex+1>parentNode.children.length) {
                return -1;
            } else {
                return nthChildIndex+steps;
            }
        }
    })();
    if(nextNthChildIndex===-1) 
        return -1
    else 
        return parentNode.children[nextNthChildIndex];
} // getNextSibling

document.querySelector("#click-mode").addEventListener("click", event=>{
    if(!event.target.matches(".active")) return;
    const activeChild = event.target;
    const nextNthChild = getNextSibling(1, activeChild, true); // true, cycling back for index exceeding length

    activeChild.classList.remove("active");
    nextNthChild.classList.add("active");
})

// Setup modifier keys
class keyboardSoundInterface {
    constructor() {
        this.octave = 0;
        this.selectKey = (intervalNotation)=>{
            let homeKey = document.querySelector(".root");
            if(!homeKey) {

                // console.log("Error: Home key not selected, so unable to build music interval");
                homeKey = document.querySelector(".position:nth-child(4)");
                homeKey.classList.add("root")
            }

            clearAllNotations();
            const steps = ((intnt)=>{
                if(intnt==='o') return 0;
                if(intnt==='A4' || intnt==='D5') return 6 + (this.octave*12);
                return ['u','m2','M2','m3','M3','P4','D5','P5', 'm6','M6','m7','M7'].indexOf(intnt) + (this.octave*12);
            })(intervalNotation)
            // console.log({intervalNotation, steps});
            const nextIntervalKey = getNextSibling(steps, homeKey, false); // true, cycling back for index exceeding length
            if(nextIntervalKey===-1) {
                console.log("Error: Out of bound with piano keyboard");
                return;
            }
            console.log(nextIntervalKey)
            nextIntervalKey.setAttribute("interval-answer", intervalNotation);
        }
        this.holdKey = ()=>{
            
        }
        this.releaseKey = ()=>{
            
        }
        /**
         * 
         * @param {*} octaveStep -2,-1,0,1,2
         */
        this.eyesOnAnotherOctave = (octaveStep) => {
            this.octave = octaveStep
        }
        this.eyesBackToRootOctave = () => {
            this.octave = 0;
        }

    }
}

class midiAdapter {
    constructor() {

    }
}

const kbsi = new keyboardSoundInterface();
// Alternately: Mouseover mechanism for changing octaves. Maybe for Guitar later.
// document.querySelector("#octaves").addEventListener('mouseover', function(e) {
//     if(e.target.matches(".octave:nth-child(1)")) {
//         kbsi.eyesOnAnotherOctave(-2)
//     } else if(e.target.matches(".octave:nth-child(2)")) {
//         kbsi.eyesOnAnotherOctave(-1)
//     } else if(e.target.matches(".octave:nth-child(3)")) {
//         kbsi.eyesOnAnotherOctave(1)
//     } else if(e.target.matches(".octave:nth-child(4)")) {
//         kbsi.eyesOnAnotherOctave(2)
//     }
// });
// document.querySelector("#octaves").addEventListener('mouseout', function(e) {
//     kbsi.eyesBackToRootOctave();
// });
document.body.addEventListener('keydown', function(e) {

        // Standardize for code
        // e.key=(e.key || e.keyIdentifier || e.keyCode)
        // console.log({key:e.key});

        // Standardization:
        // Mac's Option is Window's ALT, is e.altKey
        // Mac's Control is Window's CTRL, as expected
        // Mac's CMD is Window's Window/Start key, is e.metaKey

        function hasKey(key) {
            return key.length===1;
        }
        let isMajor = !e.shiftKey;

        // Possible since 2015 to determine even more modifier key / control details. For example, "Left" or "Right" Alt. Misc is "Standard"
        var keyLocationDefs = ["Standard", "Left", "Right", "Numpad", "Mobile", "Joystick"];
        var keyLocation = keyLocationDefs[e.location]; // Web browser api e.location is an integer

        let octaves = 0;
        if(keyLocation==="Left" && e.altKey && !e.ctrlKey)
            kbsi.eyesOnAnotherOctave(-1);
        else if(keyLocation==="Left" && e.altKey && e.ctrlKey)
            kbsi.eyesOnAnotherOctave(-2);
        else if(keyLocation==="Right" && e.altKey && !e.ctrlKey)
            kbsi.eyesOnAnotherOctave(1);
        else if(keyLocation==="Right" && e.altKey && e.ctrlKey)
            kbsi.eyesOnAnotherOctave(2);
        // This is necessary because detecting keyLocation will revert back to Standard once a key is hit regardless if a modifier key is on
        else if(!e.altKey && !e.ctrlKey)
            kbsi.eyesBackToRootOctave();

        // console.log("Test case minor");
        // console.log({mk:e.metaKey, ak:e.altKey, sk: e.shiftKey, key:e.key, keyLength:e.key.length, keyCode:e.keyCode, code: e.code})
        console.log({keyLocation,code:e.cod3})

        // Major
        if([
            "KeyW", 
            "KeyA", 
            "KeyS", 
            "KeyD", 
            "KeyE", 
            "KeyF", 
            "KeyC",
        ].includes(e.code)) {
            e.preventDefault();


            // console.log({location:e.location,keyLocation,octaves,code:e.code})

            if(e.code==="KeyW") { // minor
                kbsi.selectKey(isMajor?"u":"u");
            } else if(e.code==="KeyA") { 
                kbsi.selectKey(isMajor?"M7":"m7");
            } else if(e.code==="KeyS") { 
                kbsi.selectKey(isMajor?"P5":"D5");
            } else if(e.code==="KeyD") { 
                kbsi.selectKey(isMajor?"M3":"m3");
            } else if(e.code==="KeyE") { 
                kbsi.selectKey(isMajor?"M2":"m2");
            } else if(e.code==="KeyF") { 
                kbsi.selectKey(isMajor?"P4":"A4");
            } else if(e.code==="KeyC") { 
                kbsi.selectKey(isMajor?"M6":"m6");
            }

        } else if (!e.metaKey && !e.altKey && !e.shiftKey && e.key.toLowerCase()==="h") {
            const clickModeEl = document.querySelector("#click-mode");
            clickModeEl.querySelector(".active")?.classList?.remove("active");
            clickModeEl.querySelector("li#select-root").classList.add("active");
        } else if (!e.metaKey && !e.altKey && !e.shiftKey && e.key.toLowerCase()==="i") {
            const clickModeEl = document.querySelector("#click-mode");
            clickModeEl.querySelector(".active")?.classList?.remove("active");
            clickModeEl.querySelector("li#get-interval").classList.add("active");
        } else if (!e.metaKey && !e.altKey && !e.shiftKey && e.key.toLowerCase()==="n") {
            const clickModeEl = document.querySelector("#click-mode");
            clickModeEl.querySelector(".active")?.classList?.remove("active");
            clickModeEl.querySelector("li#highlight-note").classList.add("active");
        }


        return;




        console.log({altOptKey:e.altKey})
    
        // Resizing vs Rearranging vs Plain
        if ((e.metaKey || e.ctrlKey) && (!e.shiftKey && !e.altKey && !hasKey(e.key))) {
            // changeBoxMode("resizable")
            // console.log("Try resizing mode")
        } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && (!e.altKey && !hasKey(e.key))) {
            // changeBoxMode("rearrange")
            // console.log("Try rearranging mode")
        } else { // resets in other cases
            // changeBoxMode("plain")
            // console.log("Try plain mode")
        }

        // [Special + Alt + n]
        if ((e.metaKey || e.ctrlKey) && e.altKey && (e.key.toLowerCase()==="n"||e.key.toLowerCase()==="dead")) { // Opt+n is a special character on Mac
            // addBox();
        // [Special + Alt + t]
        } else if ((e.metaKey || e.ctrlKey) && e.altKey && (e.key.toLowerCase()==="t"||e.key.toLowerCase()==="†")) { // Opt+n is a special character on Mac
            // precheckCanDuplicateBox()();
        // [Special + Alt + Backspace]
        } else if ((e.metaKey || e.ctrlKey) && e.altKey && e.key.toLowerCase()==="backspace") {
            // deleteLastBox();
         
        // [Special + Shift + ?]
        } else if((e.metaKey || e.ctrlKey) && e.shiftKey && hasKey(e.key) && (!e.altKey)) {
            // These can't be simply SPECIAL+P because that usually has other commands

            // Command Palette. 
            // if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase()==="p") {
            //     commandPromptUserOpen(e);
            // } else {
            //     // return;
            // }
            // e.preventDefault();
            // e.stopPropagation();

        // [Special + ?]
        } else if((e.metaKey || e.ctrlKey) && !e.shiftKey && hasKey(e.key)) {

            // // After copying/pasting, check for and fix broken handles
            // if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==="v")
            //     setTimeout(fixLayoutHandles, 100);
            // else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==="e") {
            //     slideInPageControls();
            //     toggleEditPreview();
            //     $("#btn-toggle-edit-preview").animate({color:"white"}, 500, "easeInBounce", function() {
            //         $("#btn-toggle-edit-preview").css("color", "")
            //     })
            //     setTimeout(()=>{
            //         slideOutPageControls();
            //     }, 4500)
            // }

        }
        
    });

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