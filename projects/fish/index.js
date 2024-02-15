let questions = [
	{
		"text": "\"I can breath underwater\"",
		"best": "N",
		"bad": 1
	},
	{
		"text": "\"I have legs\"",
		"best": "Y",
		"bad": 3
	},
	{
		"text": "\"I often eat food given to me by creatures larger than me\"",
		"best": "N",
		"bad": 1
	},
	{
		"text": "\"I am scared by vibrations\"",
		"best": "N",
		"bad": 2
	},
	{
		"text": "\"I have fond memories of being a fish\"",
		"best": "N",
		"bad": 5
	},
	{
		"text": "\"I dislike hooks\"",
		"best": "N",
		"bad": 1
	},
	{
		"text": "\"I prefer swimming over walking\"",
		"best": "N",
		"bad": 4
	},
	{
		"text": "\"I can see better in water than out of water\"",
		"best": "N",
		"bad": 8
	},
	{
		"text": "\"I am quicker in water than on land\"",
		"best": "N",
		"bad": 5
	},
	{
		"text": "\"I swim upstream every year.\"",
		"best": "N",
		"bad": 10
	},
	{
		"text": "\"I will eat anything, as long as it's edible\"",
		"best": "N",
		"bad": 7
	},
	{
		"text": "\"I often am prey to bears\"",
		"best": "N",
		"bad": 6
	},
	{
		"text": "\"I am in water more often than land\"",
		"best": "N",
		"bad": 14
	},
	{
		"text": "\"I will die if I eat salt\"",
		"best": "N",
		"bad": 20
	},
	{
		"text": "\"I have never spoken in my life\"",
		"best": "N",
		"bad": 12
	}
];
let question = -1;
let fishy = 0;

function next_question()
{
	question++;
	if(question >= questions.length)
	{
		document.querySelector("#question-counter").textContent = "Finished!";
		document.querySelector("#question").textContent = "You finished! Yipee!!!";
		return;
	}
	document.querySelector("#question-counter").textContent = "Question " + (question + 1) + "/" + questions.length;
	document.querySelector("#question").textContent = questions[question].text;
}
next_question();

function update_fishy_o_meter()
{
	if(fishy < 0)
		fishy = 0;
	let fishy_o_meter = document.querySelector("#fishy-o-meter");

	while(fishy_o_meter.firstChild)
		fishy_o_meter.removeChild(fishy_o_meter.firstChild);

		for (let i = 0; i < fishy; i++) {
			let bar = fishy_o_meter.appendChild(document.createElement("span"));
			bar.className = "bar";
		}
}

function button_yes()
{
	if(question >= questions.length)
		return;
	if(questions[question].best != "Y")
	{
		fishy += questions[question].bad;
		update_fishy_o_meter();
	}
	else
	{
		fishy -= 1;
		update_fishy_o_meter();
	}
	next_question();
}

function button_no()
{
	if(question >= questions.length)
		return;
	if(questions[question].best != "N")
	{
		fishy += questions[question].bad;
		update_fishy_o_meter();
	}
	else
	{
		fishy -= 1;
		update_fishy_o_meter();
	}
	next_question();
}

function button_possibly()
{
	if(question >= questions.length)
		return;
	fishy += Math.floor(questions[question].bad / 2);
	update_fishy_o_meter();
	next_question();
}

// The most important function
function updateTime()
{
	let time = new Date();
	document.querySelector("#time").textContent = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}
updateTime();
setInterval(updateTime, 1000);
