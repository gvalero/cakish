"""Poll Manus task until completion, then print the result."""
import json
import time
import requests

API_KEY = "sk--1WWHJxgKNt65UxFCWtkT1SH519UgIMvVZmAOS6xuf1xS5B3iU14V1Ex1NZVZtwsYcaBmykuUN4dV-CT9g2e4VWcOW0L"
TASK_ID = "cxbHgz4cE7gbbaWxc9r844"
POLL_INTERVAL = 20
MAX_WAIT = 900  # 15 minutes

headers = {"API_KEY": API_KEY, "accept": "application/json"}
start = time.time()

while time.time() - start < MAX_WAIT:
    r = requests.get(f"https://api.manus.ai/v1/tasks/{TASK_ID}", headers=headers)
    d = r.json()
    status = d.get("status", "").lower()
    elapsed = int(time.time() - start)
    print(f"[{elapsed}s] Status: {status}", flush=True)

    if status in ("completed", "done", "finished", "succeeded", "stopped"):
        print("\n=== TASK COMPLETE ===")
        print(json.dumps(d, indent=2, ensure_ascii=False))
        break
    elif status in ("failed", "error", "cancelled"):
        print(f"\n=== TASK FAILED: {d.get('error', status)} ===")
        print(json.dumps(d, indent=2, ensure_ascii=False))
        break

    time.sleep(POLL_INTERVAL)
else:
    print(f"\nTimed out after {MAX_WAIT}s")
