"""STEP 3 of 3 — Seed the SQLite log table with synthetic gateway traffic.

This script is independent. It runs best AFTER the classifier is trained
(STEP 2) because it uses the gateway's auto-classification for half the
requests — but it also works on its own: if no trained classifier is present,
the gateway transparently falls back to its keyword classifier, so seeding
still succeeds (you'll just see a heads-up message).

It runs a configurable number of realistic requests through the real gateway
service (classifier + rules + routing + providers) so that /v1/logs and
/v1/metrics/summary have meaningful data to display in the dashboard. A fraction
of requests are forced through the failure model to exercise the fallback path,
and timestamps are spread over the past few days.

Run on its own:
    python data/seed_logs.py --count 600

Recommended prior steps (independent):
    python data/generate_training_data.py     # STEP 1
    python ml/train_classifier.py             # STEP 2
"""
from __future__ import annotations

import argparse
import os
import random
import sys
from datetime import datetime, timedelta, timezone

# Make the project importable when run as a script.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.gateway_service import GatewayService  # noqa: E402
from app.schemas import ChatRequest, Priority, TaskType  # noqa: E402

APPLICATIONS = ["support_app", "sales_portal", "analytics_dashboard",
                "hr_assistant", "devops_console", "billing_service"]
USERS = [f"u{100 + i}" for i in range(40)]
PRIORITIES = [Priority.low, Priority.normal, Priority.normal,
              Priority.normal, Priority.high]

# Representative queries per task type (kept short; the classifier handles them).
SAMPLE_QUERIES = {
    "summarization": [
        "Summarize this customer complaint in 3 bullet points",
        "Give me a short summary of the incident report",
        "TL;DR of the quarterly sales review",
        "Condense these meeting notes into two sentences",
    ],
    "classification": [
        "Classify this support ticket as urgent or normal",
        "What category does this product review belong to",
        "Label the sentiment of this customer feedback",
        "Triage this email into the right queue",
    ],
    "short_qa": [
        "What is the capital of France?",
        "How many continents are there?",
        "What does HTTP stand for?",
        "Who is the CEO of our company?",
    ],
    "code_generation": [
        "Write a Python function to reverse a string",
        "Explain this Java stack trace and how to fix it",
        "Debug this JavaScript code that throws a null reference error",
        "Refactor this Go function to be more readable",
    ],
    "sql_generation": [
        "Generate a SQL query to get all active users",
        "Write SQL to count orders grouped by region",
        "Create a SQL query joining orders and customers on id",
        "Give me the SQL to find invoices where amount is null",
    ],
    "email_drafting": [
        "Draft an email to the customer about the shipping delay",
        "Write a follow up email to a new client",
        "Compose a polite reply regarding the refund policy",
        "Draft a short message thanking the support team",
    ],
    "data_extraction": [
        "Extract all email addresses from this chat transcript",
        "Pull out the dates and amounts from the invoice",
        "Parse the support ticket and return structured fields",
        "List all the action items from the meeting notes",
    ],
    "reasoning": [
        "Why did the login outage happen and what should we do",
        "Compare the pros and cons of the new billing system",
        "Analyze the root cause of the payment gateway errors",
        "Should we proceed with the data migration? Explain your reasoning",
    ],
}

TASK_WEIGHTS = {
    "summarization": 22, "short_qa": 20, "classification": 16,
    "sql_generation": 10, "code_generation": 10, "email_drafting": 9,
    "data_extraction": 8, "reasoning": 5,
}


def weighted_task(rng: random.Random) -> str:
    tasks = list(TASK_WEIGHTS.keys())
    weights = list(TASK_WEIGHTS.values())
    return rng.choices(tasks, weights=weights, k=1)[0]


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed synthetic gateway logs")
    parser.add_argument("--count", type=int, default=600,
                        help="number of synthetic requests to generate")
    parser.add_argument("--failure-rate", type=float, default=0.06,
                        help="fraction routed through the failure model")
    parser.add_argument("--days", type=int, default=5,
                        help="spread timestamps over the last N days")
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()

    print("[STEP 3/3] Seed synthetic gateway logs")
    rng = random.Random(args.seed)
    service = GatewayService()

    if not service.classifier.ready:
        print("  NOTE: no trained classifier found "
              "(ml/task_classifier.joblib missing).")
        print("        Seeding will use the keyword fallback classifier. "
              "For best results run STEP 2 first:")
        print("        python ml/train_classifier.py\n")

    now = datetime.now(timezone.utc)
    total_seconds = args.days * 24 * 3600

    successes = fallbacks = errors = 0
    for i in range(args.count):
        task = weighted_task(rng)
        query = rng.choice(SAMPLE_QUERIES[task])
        priority = rng.choice(PRIORITIES)

        # Mostly let latency budgets be generous; occasionally tight to exercise
        # the latency rule.
        max_latency = rng.choice([5000, 5000, 5000, 3000, 800, 500])

        force_model = None
        if rng.random() < args.failure_rate:
            force_model = "mock_failure_model"  # exercises fallback / error path

        # Half the time ask the gateway to auto-detect, half supply task_type.
        req_task_type = TaskType.auto if rng.random() < 0.5 else TaskType(task)

        # Spread timestamp randomly across the window.
        ts = (now - timedelta(seconds=rng.randint(0, total_seconds))).isoformat()

        req = ChatRequest(
            user_id=rng.choice(USERS),
            application=rng.choice(APPLICATIONS),
            query=query,
            priority=priority,
            task_type=req_task_type,
            max_latency_ms=max_latency,
            force_model=force_model,
        )
        resp = service.handle_chat(req, persist=True, timestamp=ts)
        if resp.status == "success":
            successes += 1
            if resp.fallback_used:
                fallbacks += 1
        else:
            errors += 1

    print(f"  Seeded {args.count} requests:")
    print(f"    success : {successes}")
    print(f"    fallback: {fallbacks}")
    print(f"    error   : {errors}")
    print("\n  Done. Start the API to view the data:")
    print("    uvicorn app.main:app --reload")
    print("    then open http://localhost:8000/v1/metrics/summary")


if __name__ == "__main__":
    main()
