import joblib
import numpy as np


class TaskClassifier:

    def __init__(self):

        try:
            self.model = joblib.load("ml/task_classifier.joblib")
            self.ready = True
            print("Task Classifier loaded successfully.")

        except FileNotFoundError:
            self.model = None
            self.ready = False
            print("Task Classifier model not found.")

    def classify(self, text):

        if not self.ready:
            return {
                "task": None,
                "confidence": 0.0
            }

        prediction = self.model.predict([text])[0]

        probabilities = self.model.predict_proba([text])[0]

        confidence = float(np.max(probabilities))

        return {
            "task": prediction,
            "confidence": confidence
        }