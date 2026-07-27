"""STEP 1 of 3 — Generate the labeled training dataset for the task classifier.

This script is fully independent: it has NO prerequisites and writes exactly one
output file, data/training_data.csv (columns: query,task_type).

It uses template + slot-filling to produce a good quantity (~800-1,800 rows) of
varied, realistic queries across all eight task types. Deterministic (seeded) so
the dataset is reproducible.

Run on its own:
    python data/generate_training_data.py

Next step (independent):
    python ml/train_classifier.py
"""
from __future__ import annotations

import csv
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(HERE, "training_data.csv")

SEED = 42
PER_TEMPLATE = 30  # how many filled variants to emit per template

# Shared slot vocabularies -------------------------------------------------- #
SUBJECTS = [
    "customer complaint", "support ticket", "meeting notes", "product review",
    "incident report", "quarterly report", "email thread", "chat transcript",
    "research article", "release notes", "user feedback", "policy document",
    "contract clause", "news article", "Slack conversation", "call transcript",
    "bug report", "design document", "onboarding guide", "performance review",
    "vendor proposal", "security advisory", "sprint retrospective", "FAQ page",
]
TOPICS = [
    "the new billing system", "the mobile app crash", "the login outage",
    "our refund policy", "the shipping delay", "the API rate limits",
    "the onboarding flow", "the payment gateway", "the data migration",
    "the subscription renewal", "the password reset flow", "the checkout errors",
    "the latency spike", "the failed deployment", "the pricing change",
    "the inventory mismatch", "the email bounce rate", "the cache invalidation",
]
TABLES = ["users", "orders", "transactions", "products", "tickets",
          "invoices", "employees", "sessions", "payments", "subscriptions",
          "customers", "shipments", "refunds", "logins", "campaigns"]
COLUMNS = ["status", "created_at", "amount", "region", "category",
           "email", "plan", "country", "priority", "score",
           "updated_at", "total", "channel", "tier", "currency"]
LANGS = ["Python", "JavaScript", "SQL", "Java", "Go", "TypeScript", "C#", "Ruby"]
PEOPLE = ["the customer", "a new client", "the vendor", "the support team",
          "a colleague", "the project manager", "the candidate",
          "the account owner", "the on-call engineer", "the finance team"]
QUESTIONS = [
    "What is the capital of France",
    "Who wrote Hamlet",
    "How many continents are there",
    "What does HTTP stand for",
    "When did World War II end",
    "What is the boiling point of water",
    "Who is the CEO of our company",
    "What is the speed of light",
    "How far is the moon from earth",
    "What year was the company founded",
    "What is the largest ocean on earth",
    "Who painted the Mona Lisa",
    "What is the chemical symbol for gold",
    "How many days are in a leap year",
    "What language is spoken in Brazil",
    "What does API stand for",
    "Who discovered gravity",
    "What is the tallest mountain in the world",
    "How many planets are in the solar system",
    "What is the currency of Japan",
    "When was the internet invented",
    "What is the smallest prime number",
    "Who is the author of 1984",
    "What is the freezing point of water",
]

# Templates per task type. {slot} placeholders are filled from the vocab. ---- #
TEMPLATES = {
    "summarization": [
        "Summarize this {subject} in 3 bullet points",
        "Give me a short summary of the {subject}",
        "TL;DR of {topic}",
        "Condense the following {subject} into two sentences",
        "Provide a brief recap of {topic}",
        "Summarize the key points from the {subject}",
        "Shorten this {subject} for an executive audience",
    ],
    "classification": [
        "Classify this {subject} as urgent or normal",
        "What category does this {subject} belong to",
        "Label the sentiment of this {subject}",
        "Categorize the following {subject}",
        "Is this {subject} a complaint or a question",
        "Triage this {subject} into the right queue",
        "Tag this {subject} with the correct department",
    ],
    "short_qa": [
        "{question}?",
        "Quick question: {question}?",
        "Can you tell me {question_lower}?",
        "{question}, briefly?",
        "Define {topic} in one line",
    ],
    "code_generation": [
        "Write a {lang} function to reverse a string",
        "Implement a {lang} function to sort a list of numbers",
        "Explain this {lang} stack trace and how to fix it",
        "Debug this {lang} code that throws a null reference error",
        "Refactor this {lang} function to be more readable",
        "Write {lang} code to read a CSV file",
        "Why does my {lang} program raise an index out of range exception",
    ],
    "sql_generation": [
        "Generate a SQL query to get all {column} from {table}",
        "Write SQL to count rows in the {table} table grouped by {column}",
        "Create a SQL query joining {table} and {table2} on id",
        "Give me the SQL to find {table} where {column} is null",
        "Write a query to get the top 10 {table} by {column}",
        "SQL to update the {column} of {table} where id = 5",
    ],
    "email_drafting": [
        "Draft an email to {person} about {topic}",
        "Write a follow up email to {person}",
        "Compose a polite reply to {person} regarding {topic}",
        "Draft a short message thanking {person}",
        "Write an email apologizing for {topic}",
        "Help me draft a reminder email to {person}",
    ],
    "data_extraction": [
        "Extract all email addresses from this {subject}",
        "Pull out the dates and amounts from the {subject}",
        "Parse the {subject} and return structured fields",
        "Find all the entities mentioned in this {subject}",
        "Extract the order number and status from the {subject}",
        "List all the action items from the {subject}",
    ],
    "reasoning": [
        "Why did {topic} happen and what should we do",
        "Compare the pros and cons of {topic}",
        "Walk me through step by step how to resolve {topic}",
        "Analyze the root cause of {topic}",
        "Should we proceed with {topic}? Explain your reasoning",
        "Deduce the most likely reason for {topic}",
    ],
}


def fill(template: str, rng: random.Random) -> str:
    q = QUESTIONS[rng.randrange(len(QUESTIONS))]
    return (
        template
        .replace("{subject}", rng.choice(SUBJECTS))
        .replace("{topic}", rng.choice(TOPICS))
        .replace("{table2}", rng.choice(TABLES))
        .replace("{table}", rng.choice(TABLES))
        .replace("{column}", rng.choice(COLUMNS))
        .replace("{lang}", rng.choice(LANGS))
        .replace("{person}", rng.choice(PEOPLE))
        .replace("{question_lower}", q[0].lower() + q[1:])
        .replace("{question}", q)
    )


def main() -> None:
    rng = random.Random(SEED)
    rows: list[tuple[str, str]] = []
    seen: set[tuple[str, str]] = set()

    for task_type, templates in TEMPLATES.items():
        for template in templates:
            for _ in range(PER_TEMPLATE):
                query = fill(template, rng)
                key = (query, task_type)
                if key in seen:
                    continue
                seen.add(key)
                rows.append((query, task_type))

    rng.shuffle(rows)

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["query", "task_type"])
        writer.writerows(rows)

    # quick per-class tally
    from collections import Counter
    tally = Counter(t for _, t in rows)
    print("[STEP 1/3] Generate training data")
    print(f"  Wrote {len(rows)} rows to {OUT_PATH}")
    for task, count in sorted(tally.items()):
        print(f"    {task:18s} {count}")
    print("\n  Done. Next step (independent):")
    print("    python ml/train_classifier.py")


if __name__ == "__main__":
    main()
