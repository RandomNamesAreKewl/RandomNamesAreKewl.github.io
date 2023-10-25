let commands: { [name: string] : (...args: string[]) => number } = {};

function defineCommand(name: string, callback: (... args: string[]) => number)
{
	commands[name] = callback;
}

function runCommand(cmd: string, onFail?: (Reason: string, AdditionContext?: string) => void)
{
	let args = cmd.split(" ");
	if(args[0].toLowerCase() in commands)
	{
		try {
			return commands[args[0].toLowerCase()](... args);
		} catch (e) {
			if(onFail)
				onFail("js_exception", e.message);
			return Infinity;
		}
	}
	else
	{
		if(onFail)
			onFail("cmd_not_found");
	}
}

defineCommand("error", () => {
	throw new Error(`Behold, an error you've caused.
Alarm however, this should not cause.

Your discovery must be applauded.
A test message written late in the night.

A method weaved without mallice.
Yet an error it brings fourth.

(I spent too long coming up with this :/)`);
	return 0;
});
