const imgArray = [
    "src/image/bug.webp",
    "src/image/bug.webp",
    "src/image/grass.webp",
    "src/image/grass.webp",
    "src/image/poison.webp",
    "src/image/rock.webp",
    "src/image/rock.webp",
    "src/image/poison.webp",
    "src/image/psychic.webp",
    "src/image/psychic.webp",
    "src/image/ground.webp",
    "src/image/ground.webp",
    "src/image/ice.webp",
    "src/image/ice.webp",
    "src/image/steel.webp",
    "src/image/steel.webp",
];

$(document).ready(function () {
    // Declare the global varaiables
    let playerName, timer;
    let curLives = 3;
    let time = 90;

    const $message = $(".message");
    const $liveNumber = $(".lives-number");
    const $cardContainer = $(".card-container");

    //////////////////// Functions ///////////////////////////

    /* Function to display images */
    const displayImages = function (url, title) {
        const imagesHtml = `
        <section class="card">
            <img src="${url}" alt="Pokemon ${title}" />
        </section>
    `;
        $cardContainer.append(imagesHtml);
    };

    // Function for shuffling the array of cards
    const shuffleArray = function (arr) {
        arr.sort(() => Math.random() - 0.5).forEach((img) =>
            displayImages(img, img.slice(10, 13))
        );
    };

    // Call the function when the page is loaded
    shuffleArray(imgArray);

    /* Set timer in UI function */
    const timerUI = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        $(".time").text(`${min}:${sec}`);
    };

    // Start timer function
    const startTimer = function () {
        timer = setInterval(count, 1000);
        return timer;
    };

    // Reset timer function
    const resetTimer = function () {
        clearInterval(timer);
        timer = startTimer();
    };

    /* Reset number of lives function*/
    const resetLives = function () {
        curLives = 3;
        $liveNumber.text(curLives);
    };

    // Remove class function
    const removeClasses = function () {
        $("img").removeClass("active");
        $(".card").removeClass("hidden");
    };

    // Print the timer to UI and counting function
    const count = function () {
        timerUI();
        // When 0 second, stop timer and subtract the current lives of player
        if (time === 0) {
            clearInterval(timer);
            $liveNumber.text(--curLives);
            $cardContainer.off("click");
            removeClasses();

            // Print the messages on UI
            if (curLives < 3) {
                $message.text("Time out! Try again!");
            }
            if (curLives === 0) {
                $message.text("Game over!");
            }
        }

        // Decrease 1s
        time--;
    };
    count();

    ////////////// Events ////////////////////////////////
    // Print the welcome message with the player name
    $("form").on("submit", function (e) {
        e.preventDefault();
        playerName = $("#name").val().trim();
        $(".welcome").text(`Welcome, ${playerName}!`);
        $("#name").val("");
    });

    // New game button
    $(".btn-new--game").on("click", function () {
        $message.text("");
        removeClasses();
        time = 90;
        resetTimer();
        $cardContainer.empty();

        // Call the function to  shuffle the aray of card when click new game button
        shuffleArray(imgArray);

        // Reset lives when game over
        if (curLives === 0) {
            resetLives();
        }

        // Open cards event listener
        $cardContainer.on("click", ".card", function () {
            const $this = $(this);

            // Add class function
            const addClasses = function () {
                $this.addClass("hidden");
                $this.children().addClass("active");
            };

            // Add hidden class to open the card
            if (!$this.hasClass("hidden")) {
                addClasses();
            }

            // Map out 2 cards match the src value
            const $activeImg = $(".active");
            if ($activeImg.length === 2) {
                const srcArr = $activeImg
                    .map(function () {
                        return $(this).attr("src");
                    })
                    .get();
                if (srcArr[0] === srcArr[1]) {
                    $("img").removeClass("active");
                } else {
                    // Set time out to close the card after 2s
                    setTimeout(function () {
                        removeClasses();
                    }, 500);
                }
            }

            // Print the message when winning the game
            if ($(".hidden").length === 16) {
                clearTimeout(timer);
                time = 90;
                timerUI();
                resetLives();
                $message.text("Congratulation! You won!");
            }
        });
    });
});
