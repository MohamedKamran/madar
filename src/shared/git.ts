import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'

export function findGitRoot(path: string): string | null {
  let current = resolve(path)
  while (true) {
    if (existsSync(join(current, '.git'))) {
      return current
    }
    const parent = dirname(current)
    if (parent === current) {
      return null
    }
    current = parent
  }
}

function gitOutput(rootDir: string, args: string[], trim = true): string {
  const output = execFileSync('git', ['-c', 'core.quotePath=false', ...args], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return trim ? output.trim() : output
}

function mapRepoPathToProjectPath(projectDir: string, repoDir: string, repoRelativePath: string): string | null {
  const absolutePath = resolve(repoDir, repoRelativePath)
  const relativePath = relative(resolve(projectDir), absolutePath)
  if (relativePath === '' || relativePath === '.') {
    return ''
  }
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    return null
  }
  return relativePath.replaceAll('\\', '/')
}

function decodeGitPath(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    return trimmed
      .slice(1, -1)
      .replaceAll('\\"', '"')
      .replaceAll('\\\\', '\\')
  }
  return trimmed
}

function parseStatusPath(raw: string): string {
  const trimmed = raw.trim()
  const renameIndex = trimmed.lastIndexOf(' -> ')
  return decodeGitPath(renameIndex >= 0 ? trimmed.slice(renameIndex + 4).trim() : trimmed)
}

function dedupePaths(paths: Iterable<string>): string[] {
  return [...new Set([...paths].filter((path) => path.length > 0))].sort((left, right) => left.localeCompare(right))
}

export interface GitSnapshot {
  repoRoot: string
  headSha: string
  dirtyFiles: string[]
}

export function readGitSnapshot(projectDir: string): GitSnapshot | null {
  const repoRoot = findGitRoot(projectDir)
  if (repoRoot === null) {
    return null
  }

  try {
    const headSha = gitOutput(repoRoot, ['rev-parse', '--verify', 'HEAD'])
    const statusOutput = gitOutput(repoRoot, ['status', '--porcelain=v1', '--untracked-files=all'], false)
    const dirtyFiles = dedupePaths(
      statusOutput
        .split('\n')
        .map((line) => line.trimEnd())
        .filter((line) => line.length >= 4)
        .map((line) => parseStatusPath(line.slice(3)))
        .map((repoRelativePath) => mapRepoPathToProjectPath(projectDir, repoRoot, repoRelativePath))
        .filter((path): path is string => path !== null),
    )

    return {
      repoRoot,
      headSha,
      dirtyFiles,
    }
  } catch {
    return null
  }
}

export function diffGitFilesBetweenCommits(projectDir: string, fromSha: string, toSha: string): string[] {
  if (fromSha === toSha) {
    return []
  }

  const repoRoot = findGitRoot(projectDir)
  if (repoRoot === null) {
    return []
  }

  try {
    const output = gitOutput(repoRoot, ['diff', '--name-only', '--find-renames=50%', '--no-ext-diff', fromSha, toSha, '--'])
    return dedupePaths(
      output
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((repoRelativePath) => mapRepoPathToProjectPath(projectDir, repoRoot, repoRelativePath))
        .filter((path): path is string => path !== null),
    )
  } catch {
    return []
  }
}
