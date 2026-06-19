#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
REMOTE_URL="https://github.com/frtghyujkiolsas-lab/ai-sdd.git"

cd "$ROOT_DIR"

echo "== AI Badge Studio GitHub Push =="
echo "Project: $ROOT_DIR"
echo

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed or not in PATH."
  exit 1
fi

if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

current_remote="$(git remote get-url origin 2>/dev/null || true)"
if [ "$current_remote" != "$REMOTE_URL" ]; then
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
  else
    git remote add origin "$REMOTE_URL"
  fi
fi

git config credential.helper osxkeychain

if [ -n "$(git status --short)" ]; then
  echo "There are uncommitted changes:"
  git status --short
  echo
  read -r -p "Commit these changes before pushing? [y/N] " should_commit
  if [[ "$should_commit" =~ ^[Yy]$ ]]; then
    read -r -p "Commit message [Update AI badge studio]: " commit_message
    commit_message="${commit_message:-Update AI badge studio}"
    git add .
    git commit -m "$commit_message"
  else
    echo "Push cancelled. Commit or discard changes first."
    exit 1
  fi
fi

branch="$(git branch --show-current)"
if [ -z "$branch" ]; then
  branch="main"
  git checkout -b "$branch"
fi

echo
echo "Pushing to: $REMOTE_URL"
echo "Branch: $branch"
echo
echo "If GitHub asks for credentials:"
echo "  Username: frtghyujkiolsas-lab"
echo "  Password: paste your GitHub token, not your GitHub password"
echo

git push -u origin "$branch"

echo
echo "Done. Open:"
echo "https://github.com/frtghyujkiolsas-lab/ai-sdd"
