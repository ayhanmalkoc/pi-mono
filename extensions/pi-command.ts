import { existsSync } from "fs";
import { join } from "path";
import { spawn, type ChildProcess, type SpawnOptions } from "child_process";

function getPlatformPiBinaryName(): string {
	return process.platform === "win32" ? "pi.cmd" : "pi";
}

function resolveLocalPiCli(cwd?: string): string | null {
	if (!cwd) return null;

	const candidates = [
		join(cwd, "packages", "coding-agent", "dist", "cli.js"),
		join(cwd, "node_modules", "@mariozechner", "pi-coding-agent", "dist", "cli.js"),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) return candidate;
	}

	return null;
}

/**
 * Resolve the Pi executable path used by subprocess-based extensions.
 *
 * Resolution order:
 * 1. `PI_BIN` environment variable (absolute path or command)
 * 2. `<cwd>/node_modules/.bin/pi(.cmd)` if present
 * 3. Global command (`pi` on Unix, `pi.cmd` on Windows)
 */
export function resolvePiCommand(cwd?: string): string {
	const envPiBin = process.env.PI_BIN?.trim();
	if (envPiBin) return envPiBin;

	if (cwd) {
		const localPi = join(cwd, "node_modules", ".bin", getPlatformPiBinaryName());
		if (existsSync(localPi)) return localPi;
	}

	return getPlatformPiBinaryName();
}

/**
 * Spawn a Pi subprocess in a cross-platform way.
 *
 * Preference order:
 * 1. Local JS CLI via `node <cli.js>` (no shell needed)
 * 2. Resolved `PI_BIN`/local/global pi command
 * 3. On Windows for `.cmd`, invoke through `cmd.exe /d /s /c`
 */
export function spawnPi(
	cwd: string | undefined,
	args: string[],
	options: SpawnOptions,
): ChildProcess {
	const localCli = resolveLocalPiCli(cwd);
	if (localCli) {
		return spawn(process.execPath, [localCli, ...args], options);
	}

	const command = resolvePiCommand(cwd);
	if (process.platform === "win32" && command.toLowerCase().endsWith(".cmd")) {
		const comSpec = process.env.ComSpec || "cmd.exe";
		return spawn(comSpec, ["/d", "/s", "/c", command, ...args], options);
	}

	return spawn(command, args, options);
}
