#!/bin/bash
# Restart Next.js dev server if port 3000 is not listening
cd /home/z/my-project
if ! (ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null) | grep -q ':3000 '; then
  echo "[$(date +%T)] restarting next dev" >> /home/z/my-project/keep-alive.log
  nohup node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
  disown
fi
