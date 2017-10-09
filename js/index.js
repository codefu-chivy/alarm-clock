//Clock Object
var clock = {
    index: 0,
    showWeather: false,
    current: {
        weather: null,
        alarm: null
    },
    flicker: false,
    stopButton: stopButton = document.getElementById("stop-alarm"),
    setCurrentTime: function(val) {
        var hourEl = document.getElementById("hour"), 
        minutesEl = document.getElementById("minutes"),
        colon = document.getElementById("flicker"),
        tod = document.getElementById("tod"),
        alarmAudio = document.getElementById("audio"),
        self = this,
        curTime,
        hour,
        minute,
        amPm;
        setInterval(function() {
            var alarmOne = localStorage.getItem("alarmOne") ? JSON.parse(localStorage.getItem("alarmOne")) : null,
            alarmTwo = localStorage.getItem("alarmTwo") ? JSON.parse(localStorage.getItem("alarmTwo")) : null;
            curTime = new Date().toLocaleTimeString();
            amPm = curTime.slice(curTime.length - 2, curTime.length);
            if (curTime.length === 10) {
                hour = "0" + curTime.slice(0, 1);
                minute = curTime.slice(2, 4);
            }
            else {
                hour = curTime.slice(0, 2);
                minute = curTime.slice(3, 5);
            }
            minutesEl.innerHTML = minute;
            hourEl.innerHTML = hour;
            tod.innerHTML = amPm;
            if (val) {
                colon.style.visibility = "hidden";
            }
            else {
                colon.style.visibility = "visible";
            }
            if (alarmOne) {
                if ((Number(hour) === Number(alarmOne.hour)) && (Number(minute) === Number(alarmOne.minute)) && (amPm.toLowerCase() === alarmOne.amPm)) {
                    alarmAudio.play();
                    self.stopButton.style.display = "initial";
                }
            }
            if (alarmTwo) {
                if ((Number(hour) === Number(alarmTwo.hour)) && (Number(minute) === Number(alarmTwo.minute)) && (amPm.toLowerCase() === alarmTwo.amPm)) {
                    alarmAudio.play();
                    self.stopButton.style.display = "initial";
                }
            }
            val = !val;
        }, 1000);
    },
    colors: ["maroon", "aqua", "lime", "fuchsia", "gold", "white"],
    changeColors: function() {
        var clockEl = document.getElementById("clock-container-outer"),
        colorEl = document.getElementById("color");
        clockEl.style.color = this.colors[this.index];
        if (this.index === this.colors.length - 1) {
            this.index = 0;
            colorEl.style.backgroundColor = this.colors[this.index];
        }
        else {
            this.index++;
            colorEl.style.backgroundColor = this.colors[this.index]
        }
    },
    getWeather: function() {
        this.getPosition(function(lat, long) {
            var weatherEl = document.getElementById("conditions"),
            tempEl = document.getElementById("temp"),
            temp,
            currentWeather;
            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + "da3f24827ea37d6abf9fcd37b1841746", {
                method: "get"
            }).then(function(res) {
                return res.json();
            }).then(function(json) {
                temp = json.main.temp;
                temp = Math.round((temp * (9/5)) - 459.67);
                tempEl.innerHTML = temp + "&degF";
                currentWeather = json.weather[0].main;
                weatherEl.innerHTML = currentWeather;
            });
        });
    },
    getPosition: function(callback) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            lat = pos.coords.latitude;
            long = pos.coords.longitude;
            callback(lat, long);
        }, function(err) {
            if (err) {
                fetch("http://ip-api.com/json", {
                    method: "get"
                }).then(function(res) {
                    return res.json();
                }).then(function(json) {
                    lat = json.lat;
                    long = json.lon;
                    callback(lat, long);
                });
            }
        });
    },
    setAlarm: function(hour, minutes, amPm, number) {
        var alarm = {
            hour: hour,
            minute: minutes,
            amPm: amPm
        };
        if (localStorage.getItem("alarm" + number)) {
            localStorage.removeItem("alarm" + number);
        }
        localStorage.setItem("alarm" + number, JSON.stringify(alarm));
    }
};

(function() {
    if (localStorage.getItem("alarmOne")) {
        localStorage.removeItem("alarmOne");
    }
    else if (localStorage.getItem("alarmTwo")) {
        localStorage.removeItem("alarmTwo");
    }
    clock.setCurrentTime(clock.flicker);
})();

//ALARM EVENTS

//Toggle the Weather
document.querySelector("#weather").addEventListener("click", function(e) {
    var weatherScreen = document.getElementById("weather-screen");
    clock.showWeather = !clock.showWeather;
    if (clock.showWeather) {
        weatherScreen.style.display = "initial";
        e.target.style.color = "red";
        clock.current.weather = weatherScreen;
        clock.getWeather();
    }
    else {
        clock.current.weather.style.display = "none";
        e.target.style.color = "inherit";
    }
});

//Change Colors
document.querySelector("#color").addEventListener("click", function(e) {
    var colorSelect = e.target, index = clock.index;
    clock.changeColors();
});

//Show Alarm Options When Icons Pressed
document.getElementsByClassName("alarm-button")[0].addEventListener("click", showOptions);
document.getElementsByClassName("alarm-button")[1].addEventListener("click", showOptions);

function showOptions(e) {
    var timeEl = document.getElementById("time-container"), alarmEl;
    timeEl.style.display = "none";
    if (e.target.getAttribute("id") === "alarm-button-one") {
        alarmEl = document.getElementById("alarm-screen-one");
        document.getElementById("alarm-screen-two").style.display = "none";
    }
    else {
        alarmEl = document.getElementById("alarm-screen-two");
        document.getElementById("alarm-screen-one").style.display = "none";
    }
    clock.current.alarm = alarmEl;
    alarmEl.style.display = "initial";
}


//Don't allow more than 2 digits on alarm inputs
for (var i = 0; i < document.getElementsByClassName("alarm-input").length; i++) {
    document.getElementsByClassName("alarm-input")[i].addEventListener("keypress", onlyTwoDigits);
}

function onlyTwoDigits(e) {
    var el = e.target;
    if (el.value.length >= 2 || Number(e.key) !== Number(e.key)) {
        e.preventDefault();
    }
}

//Save Alarm Times
document.getElementsByClassName("set-alarm")[0].addEventListener("click", saveTime);
document.getElementsByClassName("set-alarm")[1].addEventListener("click", saveTime);

function saveTime(e) {
    var alarmButtonEl = e.target,
    timeCont = document.getElementById("time-container"),
    amPm,
    hour,
    minute,
    number;
    if (alarmButtonEl.getAttribute("id") === "set-button-one") {
        hour = document.getElementById("alarm-one-hour").value;
        minute = document.getElementById("alarm-one-minutes").value;
        amPm = document.getElementsByClassName("amPm")[0].value;
        number = "One";
    }
    else {
        hour = document.getElementById("alarm-two-hour").value;
        minute = document.getElementById("alarm-two-minutes").value;
        amPm = document.getElementsByClassName("amPm")[1].value;
        number = "Two";
    }
    if (!amPm || (amPm !== "pm" && amPm !== "am")) {
        alert("You must select either am or pm");
        return;
    }
    if (Number(hour) > 12 || Number(minute) > 59 || minute.length < 2) {
        alert("Invalid Time");
        return;
    }
    clock.setAlarm(hour, minute, amPm, number);
    clock.current.alarm.style.display = "none";
    timeCont.style.display = "initial";
    console.log(timeCont)
}

//Stop Alarm
document.querySelector("#stop-alarm").addEventListener("click", function() {
    var sound = document.getElementById("audio"),
    alarmSoundOne,
    alarmSoundTwo;
    sound.pause();
    sound.currentTime = 0;
    alarmSoundOne = localStorage.getItem("alarmOne");
    alarmSoundTwo = localStorage.getItem("alarmTwo");
    clock.stopButton.style.display = "none";
    if (alarmSoundOne) {
        localStorage.removeItem("alarmOne");
    }
    else if (alarmSoundTwo) {
        localStorage.removeItem("alarmTwo");
    }
});