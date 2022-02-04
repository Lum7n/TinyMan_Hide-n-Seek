namespace NatureReloaded {

    window.addEventListener("load", handleLoad);

    //to count atmo-points
    let a: number = 0;

    //sets impact of last answer the user gave 
    //a-=1 -> lastA = false/ a+=1 -> lastA = true
    let lastA: boolean;

    //swipe left = no/false, swipe right = yes/true
    //answer can't be a boolean because true/false can't be overwritten with something else
    //--> if the user touches the screen by mistake (and doesn't swipe) it will give back the value that was assigned before 
    //with a string answer can be "reset" before every new question
    let answer: string = "undefined";

    //start-coordinates of touch
    let initialX: any = null;
    let initialY: any = null;
    let currentX: number;
    let currentY: number;
    let diffX: number;
    let diffY: number;

    //atmos
    let atmoGreen: HTMLAudioElement = new Audio("./audios/mixkit-natural-ambience-with-flowing-water-and-birds-61.wav");
    let atmoRed: HTMLAudioElement = new Audio("./audios/mixkit-thunderstorm-in-the-forest-2396.wav");

    //all audio clips 
    let prologue1Q: HTMLAudioElement = new Audio("./audios/prologue+question_placeh.ogg");
    let prologueAnswerYes: HTMLAudioElement = new Audio("./audios/prologue_answerYes_placeh.ogg");
    let prologueAnswerNo: HTMLAudioElement = new Audio("./audios/prologue_answerNo_placeh.ogg");
    let prologue2: HTMLAudioElement = new Audio("./audios/rest_of_prologue_placeh.ogg");

    let scene2Q: HTMLAudioElement = new Audio("./audios/scene2+question_placeh.ogg");
    let scene2AnswerYes: HTMLAudioElement = new Audio("./audios/scene2_answerYes_placeh.ogg");
    let scene2AnswerNo: HTMLAudioElement = new Audio("./audios/scene2_answerNo_placeh.ogg");

    let scene3Q1: HTMLAudioElement = new Audio("./audios/scene3+question1_placeh.ogg");
    let scene3PositiveVQ2: HTMLAudioElement = new Audio("./audios/scene3_positiveArguments_placeh.ogg");
    let scene3NegativeVQ2: HTMLAudioElement = new Audio("./audios/scene3_negativeArguments_placeh.ogg");
    let scene3BothVQ2: HTMLAudioElement = new Audio("./audios/scene3_neutralArguments_placeh.ogg");
    let scene3AnswerYes: HTMLAudioElement = new Audio("./audios/scene3_answerYes_placeh.ogg");
    let scene3AnswerNo: HTMLAudioElement = new Audio("./audios/scene3_answerNo_placeh.ogg");

    let scene4PositiveV: HTMLAudioElement = new Audio("./audios/scene4_positiveSide_placeh.ogg");
    let scene4NegativeV: HTMLAudioElement = new Audio("./audios/scene4_negativeSide_placeh.ogg");

    //all Audios
    let allAudios: HTMLAudioElement[] = [atmoGreen, atmoRed, prologue1Q, prologueAnswerYes, prologueAnswerNo,
        prologue2, scene2Q, scene2AnswerYes, scene2AnswerNo, scene3Q1, scene3PositiveVQ2, scene3NegativeVQ2,
        scene3BothVQ2, scene3AnswerYes, scene3AnswerNo, scene4PositiveV, scene4NegativeV];

    //Start-Buttons
    let startButton: HTMLButtonElement;
    let buttonTipp1: HTMLButtonElement;
    let buttonTipp2: HTMLButtonElement;
    let buttonWarning: HTMLButtonElement;

    //Imgs
    let logo: HTMLImageElement;
    let playIcon: HTMLImageElement;
    let pauseIcon: HTMLImageElement;


    function handleLoad(): void {

        logo = <HTMLImageElement>document.querySelector("#logo");
        startButton = <HTMLButtonElement>document.querySelector("#startButton");
        buttonTipp1 = <HTMLButtonElement>document.querySelector("#tipp1");
        buttonTipp2 = <HTMLButtonElement>document.querySelector("#tipp2");
        buttonWarning = <HTMLButtonElement>document.querySelector("#warning");
        playIcon = <HTMLImageElement>document.querySelector("#playIcon");
        pauseIcon = <HTMLImageElement>document.querySelector("#pauseIcon");

        startButton.addEventListener("click", handleStart);
        pauseIcon.addEventListener("click", handlePlayPause);

        document.addEventListener("touchstart", handleTouchstart, false);
        document.addEventListener("touchmove", handleTouchmove, false);

        hideLogo();

    }

    function hideLogo(): void {
        logo.style.opacity = "0";
        logo.addEventListener("transitionend", function (): void {
            logo.remove();
            startButton.style.display = "block";
        });
    }

    function handleStart(): void {
        startButton.style.display = "none";
        buttonTipp1.style.display = "block";
        buttonTipp1.addEventListener("click", hideTipp1);
        console.log("Ende Funktion handleStart");
    }

    function hideTipp1(): void {
        buttonTipp1.style.display = "none";
        buttonTipp2.style.display = "block";
        buttonTipp2.addEventListener("click", hideTipp2);
    }

    function hideTipp2(): void {
        buttonTipp2.style.display = "none";
        buttonWarning.style.display = "block";
        buttonWarning.addEventListener("click", hideWarning);
    }

    function hideWarning(): void {
        buttonWarning.style.display = "none";
        pauseIcon.style.display = "block";

        playS1Prologue();
    }


    async function playS1Prologue(): Promise<void> {

        prologue1Q.addEventListener("ended", vibrate);
        prologue1Q.play();
        console.log("startPrologue");

        console.log("wait for user to swipe");
        answer = await waitForTouchend();

        while (answer !== "Yes" && answer !== "No") {
            console.log("answer is undefined: ", answer);
            answer = await waitForTouchend();
        }

        console.log("answer: ", answer);

        if (answer === "Yes") {
            //need to solve problem for overlapping audios if user swipes too early
            //  if (prologue1Q.paused) {}  --> doesn't work, code jumps to vibrate() when swiping too early
            // .addEventlistener("ended") --> does work, but if the user actually waits long enough the next audio won't play
            console.log("answer: yes");
            prologueAnswerYes.play();
            prologueAnswerYes.addEventListener("ended", function (): void {
                console.log("rest of prologue");
                prologue2.play();
            });

        } else if (answer === "No") {
            //  if (prologue1Q.paused) {}
            console.log("answer: no");
            prologueAnswerNo.play();

            prologueAnswerNo.addEventListener("ended", function (): void {
                console.log("rest of prologue");
                prologue2.play();
            });
        }


        prologue2.addEventListener("ended", playS2Hunting);
    }

    async function playS2Hunting(): Promise<void> {
        answer = "undefined";
        atmoGreen.volume = 0.5;
        atmoGreen.play();
        console.log("start AtmoGreen at: ", atmoGreen.volume);

        atmoRed.volume = 0.5;
        atmoRed.play();
        console.log("start AtmoRed at: ", atmoRed.volume);

        scene2Q.addEventListener("ended", vibrate);
        scene2Q.play();
        console.log("start scene2 + Q");

        console.log("wait for user to swipe");
        answer = await waitForTouchend();

        while (answer !== "No" && answer !== "Yes") {
            console.log("answer is undefined: ", answer);
            answer = await waitForTouchend();
        }
        console.log("answer: ", answer);

        if (answer === "Yes") {
            scene2Q.addEventListener("ended", function (): void {
                scene2AnswerYes.play();
                a += 1;
                lastA = true;
                changeAtmo();
                console.log("answer: yes", "a: ", a, "lastA: ", lastA, "atmoGrenn: ", atmoGreen.volume, "atmoRed: ", atmoRed);
            });
            scene2AnswerYes.addEventListener("ended", function (): void {
                console.log("end of scene2");
                playS3SafeEnergy1();
            });

        } else if (answer === "No") {
            scene2Q.addEventListener("ended", function (): void {
                scene2AnswerNo.play();
                a -= 1;
                lastA = false;
                changeAtmo();
                console.log("answer: no", "a: ", a, "lastA: ", lastA, "atmoGrenn: ", atmoGreen.volume, "atmoRed: ", atmoRed);
            });
            scene2AnswerNo.addEventListener("ended", function (): void {
                console.log("end of scene2");
                playS3SafeEnergy1();
            });
        }
    }

    async function playS3SafeEnergy1(): Promise<void> {
        answer = "undefined";
        scene3Q1.addEventListener("ended", vibrate);
        scene3Q1.play();
        console.log("start Scene 3 + Q");

        console.log("wait for user to swipe");
        answer = await waitForTouchend();

        while (answer !== "No" && answer !== "Yes") {
            console.log("answer is undefined: ", answer);
            answer = await waitForTouchend();
        }
        console.log("answer: ", answer);

        if (answer === "Yes") {
            a += 1;
            lastA = true;
            changeAtmo();
            console.log("answer: yes", "a: ", a, "lastA: ", lastA, "atmoGreen: ", atmoGreen.volume, "atmoRed: ", atmoRed.volume);
        } else if (answer === "No") {
            a -= 1;
            lastA = false;
            changeAtmo();
            console.log("answer: yes", "a: ", a, "lastA: ", lastA, "atmoGreen: ", atmoGreen.volume, "atmoRed: ", atmoRed.volume);
        }

        scene3Q1.addEventListener("ended", function (): void {
            if (a < 0) {
                scene3NegativeVQ2.addEventListener("ended", vibrate);
                console.log("play scene3 Negative Version + Q");
                scene3NegativeVQ2.play();
                scene3NegativeVQ2.addEventListener("ended", function (): void {
                    playS3SafeEnergy2();
                });
            } else if (a > 0) {
                scene3PositiveVQ2.addEventListener("ended", vibrate);
                console.log("play scene3 Positive Version + Q");
                scene3PositiveVQ2.play();
                scene3PositiveVQ2.addEventListener("ended", function (): void {
                    playS3SafeEnergy2();
                });
            } else {
                scene3BothVQ2.addEventListener("ended", vibrate);
                console.log("play scene3 Both Versions + Q");
                scene3BothVQ2.play();
                scene3BothVQ2.addEventListener("ended", function (): void {
                    playS3SafeEnergy2();
                });
            }
        });
    }

    //it's easier to define a new function playS3SafeEnergy2 and call it when hte audio before has ended...
    //then to write six ended-triggers for the following audio
    async function playS3SafeEnergy2(): Promise<void> {
        answer = "undefined";

        console.log("wait for user to swipe");
        answer = await waitForTouchend();

        while (answer !== "Yes" && answer != "No") {
            console.log("answer is undefined: ", answer);
            answer = await waitForTouchend();
        }
        console.log("answer: ", answer);

        if (answer === "Yes") {
            scene3AnswerYes.play();
            a -= 1;
            lastA = false;
            changeAtmo();
            console.log("answer: yes", "a: ", a, "lastA: ", lastA, "atmoGrenn: ", atmoGreen.volume, "atmoRed: ", atmoRed);
            scene3AnswerYes.addEventListener("ended", function (): void {
                console.log("end of scene3");
                playS4Cutscene();
            });

        } else if (answer === "No") {
            scene3AnswerNo.play();
            a += 1;
            lastA = true;
            changeAtmo();
            console.log("answer: no", "a: ", a, "lastA: ", lastA, "atmoGrenn: ", atmoGreen.volume, "atmoRed: ", atmoRed);
            scene3AnswerNo.addEventListener("ended", function (): void {
                console.log("end of scene3");
                playS4Cutscene();
            });
        }
    }

    function playS4Cutscene(): void {

        console.log("play scene 4");

        if (a > 0) {
            console.log("play scene 4 positiveV");
            scene4PositiveV.play();
        }
        else if (a < 0) {
            console.log("play scene 4 negativeV");
            scene4NegativeV.play();
        } else {
            if (lastA == true) {
                console.log("play scene 4 positiveV");
                scene4PositiveV.play();
            } else {
                console.log("play scene 4 negativeV");
                scene4NegativeV.play();
            }
        }
    }

    //gibt Koordinaten der ersten touchpoints wieder
    function handleTouchstart(e: TouchEvent): void {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
        console.log(initialX, initialY, e.touches[0]);
    }

    //get swipe left/right -> set answer
    function handleTouchmove(e: TouchEvent): void {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        diffX = initialX - currentX;
        diffY = initialY - currentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // sliding horizontally
            if (diffX > 0) {
                // swiped left
                console.log("swiped left");
                answer = "No";
                //  console.log(answer);
            } else {
                // swiped right
                console.log("swiped right");
                answer = "Yes";
                //console.log(answer);
            }
        }
    }

    function changeAtmo(): void {
        console.log("test");
        if (lastA == true) {
            atmoGreen.volume += 0.1;
            atmoRed.volume -= 0.1;
        } else {
            atmoGreen.volume += 0.1;
            atmoRed.volume -= 0.1;
        }
    }

    //make phone vibrate 
    function vibrate(): void {
        if ("vibrate" in navigator) {
            console.log("Vibration supported");
        } else {
            // Vibration not supported
            console.log("Vibration not supported");
        }
        navigator.vibrate(1000);
    }

    //wait for user to end touch
    async function waitForTouchend(): Promise<string> {
        return new Promise((resolve) => {
            document.addEventListener("touchend", function (): void {
                resolve(answer);
            }, { once: true });
        });
    }

    //play/pause audio currently playing
    async function handlePlayPause(): Promise<void> {
        console.log("pause!");
        pauseIcon.style.display = "none";
        playIcon.style.display = "block";
        let clickPlay: boolean = false;
        let audiosPaused: HTMLAudioElement[] = [];
        let pausedAudio: HTMLAudioElement;
        let currentAudio: HTMLAudioElement;

        //iterate through array of all audios and pause current audio playing
        for (currentAudio of allAudios) {
            if (!currentAudio.paused) {
                console.log("currentAudio playing:", currentAudio);
                currentAudio.pause();
                //push currentAudio in audiosPaused
                audiosPaused.push(currentAudio);
            } /*else {
                console.log("audio", currentAudio, "not playing right now");
            }*/
        }

        //wait for user to click play again
        clickPlay = await waitForClickPlay();
        console.log("did user click play again?: ", clickPlay);
        pauseIcon.style.display = "block";
        playIcon.style.display = "none";

        //iterate through pausedAudios to play them again
        for (pausedAudio of audiosPaused) {
            //if user clicked play, play audio that was paused before
            if (clickPlay == true) {
                console.log("continue ", pausedAudio);
                pausedAudio.play();
                //delete pausedAudio from audiosPaused, cause it's not paused anymore
                audiosPaused.splice(0, 1, pausedAudio);
            }

        }

    }

    //wait for user to click play again
    async function waitForClickPlay(): Promise<boolean> {

        return new Promise((resolve) => {
            playIcon.addEventListener("click", function (): void {
                resolve(true);

            }, { once: true });
        });
    }
}