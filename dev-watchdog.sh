#!/bin/bash
# Watchdog: keep Next.js dev server running on port 3000
cd /home/z/my-project
while true; do
  if ! (ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null) | grep -q ':3000 '; then
    echo "[$(date +%T)] starting next dev..." >> /home/z/my-project/dev-watchdog.log
    node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    NEXT_PID=$!
    echo "[$(date +%T)] next dev pid=$NEXT_PID" >> /home/z/my-project/dev-watchdog.log
    wait $NEXT_PID
    echo "[$(date +%T)] next dev exited with code $?" >> /home/z/my-project/dev-watchdog.log
    sleep 2
  else
    sleep 5
  fi
done
