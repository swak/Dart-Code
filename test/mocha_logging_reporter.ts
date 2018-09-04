import { ITest, reporters } from "mocha";
import { LogCategory, LogSeverity, safeSpawn } from "../src/debug/utils";
import { log } from "../src/utils/log";
import testRunner = require("vscode/lib/testrunner");

export class LoggingReporter extends reporters.Base {
	constructor(runner: any, options: any) {
		super(runner);

		// runner.on("start", () => { });

		runner.on("test", (test: ITest) => {
			log(`Starting test ${test.fullTitle()}...`, LogSeverity.Info, LogCategory.CI);
		});

		runner.on("pending", (test: ITest) => {
			log(`Test ${test.fullTitle()} pending/skipped`, LogSeverity.Info, LogCategory.CI);
		});

		runner.on("pass", (test: ITest) => {
			log(`Test ${test.fullTitle()} passed after ${test.duration}ms`, LogSeverity.Info, LogCategory.CI);
		});

		runner.on("fail", async (test: ITest) => {
			log(`Test ${test.fullTitle()} failed after ${test.duration}ms`, LogSeverity.Error, LogCategory.CI);
			const err = (test as any).err;
			if (err) {
				log(err.message, LogSeverity.Error, LogCategory.CI);
				log(err.stack, LogSeverity.Error, LogCategory.CI);
			}

			await new Promise((resolve) => {
				const proc = safeSpawn(undefined, "bash", ["-c", 'pgrep flutter_tester | xargs -I % lldb -p % -o "thread backtrace all" -b']);
				proc.stdout.on("data", (data) => console.warn(data.toString()));
				proc.stderr.on("data", (data) => console.warn(data.toString()));
				proc.on("close", (code) => console.warn(`close code ${code}`));
				proc.on("exit", (code) => console.warn(`exit code ${code}`));
			});
		});

		// runner.once("end", () => { });
	}
}
