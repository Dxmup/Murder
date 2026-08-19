#!/usr/bin/env bash
# End-to-end checks against a running dev server (npm run dev).
#
# Covers the things that would ruin the party if they broke: the auth boundary
# between players and the host, and act gating — mail must never arrive before
# the host opens its act.
set -uo pipefail

BASE="${BASE:-http://localhost:3000}"
JAR="$(mktemp -d)"
PLAYER="$JAR/player.txt"
HOST="$JAR/host.txt"
fails=0

pass() { echo "ok   $1"; }
fail() { echo "FAIL $1: $2"; fails=$((fails + 1)); }
check() { [ "$2" = "$3" ] && pass "$1" || fail "$1" "got '$2', want '$3'"; }

# Reset the clock so the run is repeatable.
rm -f .data/state.json

code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
ids() { curl -s -b "$PLAYER" "$BASE/" | grep -oE '\\"li\\",\\"V2M[0-9]+' | sed 's/.*V2M/V2M/' | sort -u | tr '\n' ' ' | sed 's/ $//'; }

echo "--- auth ---"
check "wrong password is rejected" \
  "$(curl -s -o /dev/null -w '%{redirect_url}' -X POST -d 'email=abell@veridiandynamics.org&password=nope' "$BASE/api/login")" \
  "$BASE/login?error=1"

curl -s -c "$PLAYER" -o /dev/null -X POST \
  -d 'email=abell@veridiandynamics.org&password=pressproofregmarks' "$BASE/api/login"
check "player reaches inbox" "$(code -b "$PLAYER" "$BASE/")" "200"

curl -s -c "$HOST" -o /dev/null -X POST \
  -d "email=${HOST_EMAIL:-host@veridiandynamics.org}&password=${HOST_PASSWORD:-fifteenyears}" "$BASE/api/login"
check "host reaches dashboard" "$(code -b "$HOST" "$BASE/host")" "200"

echo "--- host boundary ---"
check "player is bounced from dashboard" "$(code -b "$PLAYER" "$BASE/host")" "307"
check "player cannot drive the clock" \
  "$(code -b "$PLAYER" -X POST -d 'act=1&action=start' "$BASE/api/clock")" "403"
check "anonymous cannot drive the clock" \
  "$(code -X POST -d 'act=1&action=start' "$BASE/api/clock")" "403"

echo "--- act gating ---"
# Regression: offset-0 mail in every act once satisfied `0 >= 0` and shipped
# before the act had started, exposing act 3's ballot prompt at sign-in.
check "only pre-loaded mail before any act starts" "$(ids)" "V2M041"

curl -s -b "$HOST" -o /dev/null -X POST -d 'act=1&action=start' "$BASE/api/clock"
check "act 1 opener arrives once act 1 starts" "$(ids)" "V2M001 V2M041"

curl -s -b "$HOST" -o /dev/null -X POST -d 'act=1&action=pause' "$BASE/api/clock"
check "pausing act 1 delivers nothing new" "$(ids)" "V2M001 V2M041"

check "undelivered mail 404s by direct id" "$(code -b "$PLAYER" "$BASE/m/V2M037")" "404"

echo "--- briefing ---"
# The booklet is rendered from characters/, not messages.csv, so it is easy to
# lose in a refactor. It must be present before any act starts.
check "briefing is readable" "$(code -b "$PLAYER" "$BASE/m/BRIEFING")" "200"
brief=$(curl -s -b "$PLAYER" "$BASE/m/BRIEFING")
case "$brief" in
  *"Executive Director of Veridian Dynamics"*) pass "briefing carries the booklet" ;;
  *) fail "briefing carries the booklet" "booklet text missing" ;;
esac
case "$brief" in
  *'## Who you are'*|*'\u003c/h2\u003e## '*) fail "briefing renders markdown" "raw '##' reached the page" ;;
  *) pass "briefing renders markdown" ;;
esac
# The host must never be able to read a player's private briefing by URL.
check "host cannot open a player briefing" "$(code -b "$HOST" "$BASE/m/BRIEFING")" "307"

curl -s -b "$HOST" -o /dev/null -X POST -d 'act=1&action=reset' "$BASE/api/clock"
check "resetting act 1 withdraws its mail" "$(ids)" "V2M041"

rm -rf "$JAR"
echo
[ "$fails" -eq 0 ] && echo "ALL PASS" || echo "$fails FAILURES"
exit $((fails > 0))
