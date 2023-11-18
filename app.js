var autogen = [];
var uservalues = [];
var levelIterator = 1;

function keyPressVerify(){
    return new Promise((resolve) => {
        $(document).on("keypress",(e) => {
            resolve(true);
        })
    })
}

function playSound(clname){
   return new Promise((resolve) => {
        switch(clname){
            case "rgb(255, 0, 0)":
                var audio = new Audio("sounds/1.mp3");
                audio.play();
                break;

            case "rgb(0, 0, 255)":
                var audio = new Audio("sounds/2.mp3");
                audio.play();
                break;

            case "rgb(255, 255, 0)":
                var audio = new Audio("sounds/3.mp3");
                audio.play();
                break;

            case "rgb(0, 128, 0)":
                var audio = new Audio("sounds/4.mp3");
                audio.play();
                break;
        }
        resolve("audio played");
   })
}

function animationPressed(element) {
    return new Promise((resolve) => {
        $(element).animate({
        'width': '14.5rem',
        'height': '14.5rem'
        }, 200, function() {
            $(element).animate({
                'width': '15rem',
                'height': '15rem'
            }, 200);
        });
        playSound($(element).css("backgroundColor"));
        resolve(element);
    })
}

function verify(){
    return new Promise((resolve) => {
        if(autogen.toString() === uservalues.toString()){
            resolve(true);
            uservalues = [];
        }
        else{
            resolve(false);
        }
    })
}


function processIterations(count) {
    return new Promise(async (resolve) => {
        var random = Math.floor(Math.random() * 4) + 1;
        autogen.push(random);
        var element = $(".box-container").children().eq(random-1);
        autogen.forEach(async () => {
            await animationPressed(element);
        });
        resolve("Iterations completed");
    });
}

function userInput() {
    return new Promise(async (resolve) => {
        try {
            var i = 1;

            function handleClick(e) {
                return new Promise(async (innerResolve) => {
                    await animationPressed($(e.target)).then((element) => {
                        switch (element.css("backgroundColor")) {
                            case "rgb(255, 0, 0)":
                                uservalues.push("1");
                                i++;
                                break;

                            case "rgb(0, 0, 255)":
                                uservalues.push("4");
                                i++;
                                break;

                            case "rgb(255, 255, 0)":
                                uservalues.push("2");
                                i++;
                                break;

                            case "rgb(0, 128, 0)":
                                uservalues.push("3");
                                i++;
                                break;
                        }
                        innerResolve();
                    });
                });
            }

            $(".box").on("click", await handleClick);

            while (i <= levelIterator) {
                await new Promise((innerResolve) => setTimeout(innerResolve, 100));
            }

            $(".box").off("click", handleClick);
            const flag = await verify();
            resolve(flag);
        } catch (err) {
            console.log(err);
        }
    });
}



async function start() {
    try {
        $(".header").text(`LEVEL ${levelIterator}`);

        await new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
        await processIterations(levelIterator);
        const response = await userInput();
        if (response) {
            levelIterator++;
            start();
        } else {
            $(".header").text("GAME OVER");
        }
    } catch (err) {
        console.error(err);
    }
}


function keyPressWaiting() {
    keyPressVerify().then(response => start());
}


$(document).ready(()=>{
    keyPressWaiting();
})