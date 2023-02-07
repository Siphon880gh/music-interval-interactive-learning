// For VS Editor Outline
delete {
    "Setup::":{
        "Setup midi adapter":{},
        "Setup data structures":{},
        "Setup event listeners":{},
        "Setup modifier keys":{
            "keyboardSoundInterface": {}
        }
    },
    "Intervals::":{
        "Calculate interval difference":{},
        "Clear all notations":{},
    },
}

// Setup midi adapter
class midiAdapter {
    constructor() {
        return new NotesPlayer();
    }
}
const tunes = new midiAdapter();

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

                // Set interval result section and play fixed duration note
                    switch (intervalNotation) {
                        case "u":
                            document.querySelector("#result-interval").innerHTML = "Unison (u)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "o":
                            document.querySelector("#result-interval").innerHTML = "Octave (o)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "m2":
                            document.querySelector("#result-interval").innerHTML = "Minor 2nd (m2)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "M2":
                            document.querySelector("#result-interval").innerHTML = "Major 2nd (M2)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "m3":
                            document.querySelector("#result-interval").innerHTML = "Minor 3rd (m3)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "M3":
                            document.querySelector("#result-interval").innerHTML = "Major 3rd (M3)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "P4":
                            document.querySelector("#result-interval").innerHTML = "Perfect 4th (P4)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "D5":
                            document.querySelector("#result-interval").innerHTML = "Augmented 4th / Diminished 5th (A4 / D5)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "P5":
                            document.querySelector("#result-interval").innerHTML = "Perfect 5th (P5)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "m6":
                            document.querySelector("#result-interval").innerHTML = "Minor 6th (m6)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "M6":
                            document.querySelector("#result-interval").innerHTML = "Major 6th (M6)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "m7":
                            document.querySelector("#result-interval").innerHTML = "Minor 7th (m7)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        case "M7":
                            document.querySelector("#result-interval").innerHTML = "Major 7th (M7)";
                            kbsi.releaseKey();
                            kbsi.selectKey("graphical", {UIPressed: event.target}); // DO NOT render interval note on graphical as well. Done already.
                            kbsi.pressKey();
                            break;
                        default:
                            console.error("Error: Interval not found");
                    }

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
    console.log({nthChildIndex,element:parentNode.children[nextNthChildIndex]});
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
        this.octave = 0; // This is user chosen octave
        this.absoluteOctave = 0; // This is absolute octave to the instrument layout for translating into numeric pitches for MIDI Adapter
        this.key = "C"
        this.holdingCombos = []; // Eg. [EEEEE, SSSSS, DDDDD] held then let go later. These are actually setInterval ID's for clearInterval when releasing

        this.keyPressedBPM = 60; // How many beats in 60 seconds
        this.keyPressedNoteValue = 1; // Note Value / Top number of time signature. How long in seconds is 1 beat


        this.selectKey = (from="keyboard", settings)=>{

            if(from==="graphical") {
                const {UIPressed} = settings;
                const [absoluteNote, absoluteOctave] = [UIPressed.getAttribute("note"), UIPressed.getAttribute("octave")];
            }

            if(from==="keyboard") {
                const {intervalNotation, render=true} = settings;

                // Make sure there's a root / home
                let homeKey = document.querySelector(".root");
                if(!homeKey) {

                    // console.log("Error: Home key not selected, so unable to build music interval");
                    homeKey = document.querySelector(".position:nth-child(4)");
                    homeKey.classList.add("root")
                }

                // Visually
                clearAllNotations();
                const steps = ((intnt)=>{
                    if(intnt==='o') return 0;
                    if(intnt==='A4' || intnt==='D5') return 6 + (this.octave*12);
                    return ['u','m2','M2','m3','M3','P4','D5','P5', 'm6','M6','m7','M7'].indexOf(intnt) + (this.octave*12);
                })(intervalNotation)
                // console.log({intervalNotation, steps});
                const nextIntervalKey = getNextSibling(steps, homeKey, false); // true, cycling back for index exceeding length
                if(nextIntervalKey===-1) {
                    console.error("Error: Out of bound with piano keyboard");
                    return;
                }
                console.log(nextIntervalKey)
                if(render)
                    nextIntervalKey.setAttribute("interval-answer", intervalNotation);

                // Model for midi adapter
                // Refers HTML: <div id="pos-1" octave="-2" note="A" class="position">1</div>
                this.key = nextIntervalKey.getAttribute("note");
                this.absoluteOctave = nextIntervalKey.getAttribute("octave");
                
            }
        } // selectKey
        this.holdKey = ()=>{
            function burstSound() {
                console.log({key:this.key})
                tunes.playing(this.key, this.absoluteOctave)
            }
            burstSound.apply(this);
            this.holdingCombos.push(
                setInterval(burstSound.bind(this),310)
            )
        }
        this.releaseKey = ()=>{
            tunes.stopAll();
            this.holdingCombos.forEach((holdingCombo)=>{
                clearInterval(holdingCombo)
            })
        }
        this.pressKey = ()=> {
            tunes.play(this.key, this.octave, this.keyPressedBPM, this.keyPressedNoteValue)
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
document.body.addEventListener('keyup', function(e) {
    console.log("RELEASED KEY: " + e.key)
    kbsi.releaseKey();
});

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
        console.log({keyLocation,code:e.code})

        // Major
        if([
            "KeyW", 
            "KeyA", 
            "KeyS", 
            "KeyD", 
            "KeyE", 
            "KeyF", 
            "KeyC", 
            "Digit1",
            "Digit2",
            "Digit3",
            "Digit4",
            "Digit5",
            "Digit6",
            "Digit7",
            "Numpad1",
            "Numpad2",
            "Numpad3",
            "Numpad4",
            "Numpad5",
            "Numpad6",
            "Numpad7",
        ].includes(e.code)) {
            e.preventDefault();


            // console.log({location:e.location,keyLocation,octaves,code:e.code})

            if(e.code==="KeyW") { // minor
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"u":"u", render:true}); // render interval note on graphical as well
                kbsi.holdKey();
            } else if(e.code==="KeyA") { 
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"M7":"m7", render:true});
                kbsi.holdKey();
            } else if(e.code==="KeyS") { 
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"P5":"D5", render:true});
                kbsi.holdKey();
            } else if(e.code==="KeyD") { 
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"M3":"m3", render:true});
                kbsi.holdKey();
            } else if(e.code==="KeyE") { 
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"M2":"m2", render:true});
                kbsi.holdKey();
            } else if(e.code==="KeyF") { 
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"P4":"A4", render:true});
                kbsi.holdKey();
            } else if(e.code==="KeyC") { 
                kbsi.selectKey("keyboard", {intervalNotation:isMajor?"M6":"m6", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit1" || e.code==="Numpad1") { 
                kbsi.selectKey("keyboard", {intervalNotation:"u", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit2" || e.code==="Numpad2") { 
                kbsi.selectKey("keyboard", {intervalNotation:"M2", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit3" || e.code==="Numpad3") { 
                kbsi.selectKey("keyboard", {intervalNotation:"M3", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit4" || e.code==="Numpad4") { 
                kbsi.selectKey("keyboard", {intervalNotation:"P4", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit5" || e.code==="Numpad5") { 
                kbsi.selectKey("keyboard", {intervalNotation:"P5", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit6" || e.code==="Numpad6") { 
                kbsi.selectKey("keyboard", {intervalNotation:"M6", render:true});
                kbsi.holdKey();
            } else if(e.code==="Digit7" || e.code==="Numpad7") { 
                kbsi.selectKey("keyboard", {intervalNotation:"M7", render:true});
                kbsi.holdKey();
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
}); // Modifier keys

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