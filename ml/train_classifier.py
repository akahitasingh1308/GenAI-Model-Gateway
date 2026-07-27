"""STEP 2 of 3 — Train the task-type classifier on the synthetic dataset.

This script is independent but has ONE prerequisite: data/training_data.csv must
exist (produced by STEP 1). If it is missing the script stops with a clear
message telling you which command to run first.

Pipeline: TF-IDF (1-2 grams) -> Logistic Regression. The trained pipeline is
saved to ml/task_classifier.joblib and loaded automatically by the gateway.

Run on its own (after STEP 1):
    python ml/train_classifier.py

Prerequisite (STEP 1):
    python data/generate_training_data.py

Next step (independent):
    python data/seed_logs.py --count 600
"""
from __future__ import annotations

import os

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA_PATH = os.path.join(ROOT, "data", "training_data.csv")
ARTIFACT_PATH = os.path.join(HERE, "task_classifier.joblib")


def build_pipeline() -> Pipeline:
    return Pipeline([
        ("tfidf", TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True,
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            C=4.0,
            class_weight="balanced",
        )),
    ])


def main() -> None:
    print("[STEP 2/3] Train task classifier")
    if not os.path.exists(DATA_PATH):
        raise SystemExit(
            f"  Prerequisite missing: training data not found at {DATA_PATH}.\n"
            "  Run STEP 1 first: python data/generate_training_data.py"
        )

    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["query", "task_type"])
    X, y = df["query"].astype(str), df["task_type"].astype(str)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    print("=== Classification report (held-out test set) ===")
    print(classification_report(y_test, pipeline.predict(X_test)))

    # Refit on the full dataset before saving for best production performance.
    pipeline.fit(X, y)
    joblib.dump(pipeline, ARTIFACT_PATH)
    print(f"Saved trained classifier to {ARTIFACT_PATH}")
    print("\n  Done. Next step (independent):")
    print("    python data/seed_logs.py --count 600")


if __name__ == "__main__":
    main()
