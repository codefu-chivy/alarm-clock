//Clock Object
var clock = {
    index: 0,
    showWeather: false,
    current: null,
    flicker: false,
    setCurrentTime: function(val) {
        var hourEl = document.getElementById("hour"), 
        minutesEl = document.getElementById("minutes"),
        colon = document.getElementById("flicker"),
        curTime,
        hour,
        minute;
        setInterval(function() {
            curTime = new Date().toLocaleTimeString();
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
            if (val) {
                colon.style.visibility = "hidden";
            }
            else {
                colon.style.visibility = "visible";
            }
            if (localStorage.getItem("alarmOne")) {

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
    setAlarmOne: function(hour, minutes, amPm) {
        var alarmOne = {
            hour: hour,
            minute: minutes,
            amPm: amPm
        };
        localStorage.setItem("alarmOne", JSON.stringify(alarmOne));
    }
}

clock.setCurrentTime(clock.flicker);

//ALARM EVENTS

//Toggle the Weather
document.querySelector("#weather").addEventListener("click", function(e) {
    var weatherScreen = document.getElementById("weather-screen");
    clock.showWeather = !clock.showWeather;
    if (clock.showWeather) {
        weatherScreen.style.display = "initial";
        e.target.style.color = "red";
        clock.current = weatherScreen;
        clock.getWeather();
    }
    else {
        clock.current.style.display = "none";
        e.target.style.color = "inherit";
    }
});

//Change Colors
document.querySelector("#color").addEventListener("click", function(e) {
    var colorSelect = e.target, index = clock.index;
    clock.changeColors();

});
